
'use client';

import type { ChecklistItem as ChecklistItemType } from '@/types'; 
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX } from '@/constants/storageKeys';
import { useEffect, useState } from 'react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggleComplete: (id: string) => void;
  isInitiallyCompleted: boolean; 
}

export function ChecklistItem({ item, onToggleComplete, isInitiallyCompleted }: ChecklistItemProps) {
  const { Icon } = item;
  const [isCompleted, setIsCompleted] = useState(isInitiallyCompleted);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [completedSubStepCount, setCompletedSubStepCount] = useState(0);
  const [totalSubStepCount, setTotalSubStepCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
        setIsCompleted(isInitiallyCompleted);
    }
  }, [isInitiallyCompleted, isMounted]);

  const hasSteps = item.steps && item.steps.length > 0;

  useEffect(() => {
    if (isMounted && !isCompleted && hasSteps) {
      const subTaskStorageKey = `${LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX}${item.id}`;
      let currentCompletedCount = 0;
      const currentTotalCount = item.steps.length;
      setTotalSubStepCount(currentTotalCount);

      try {
        const storedSubCompletionsJSON = localStorage.getItem(subTaskStorageKey);
        if (storedSubCompletionsJSON) {
          const subCompletions = JSON.parse(storedSubCompletionsJSON) as Record<string, boolean>;
          item.steps.forEach(step => {
            if (subCompletions[step.id]) {
              currentCompletedCount++;
            }
          });
        }
      } catch (error) {
        console.error(`Failed to load sub-step progress for task ${item.id}:`, error);
      }
      setCompletedSubStepCount(currentCompletedCount);
    } else if (isCompleted && hasSteps) { // If main task is completed, all sub-steps are considered complete for progress display
      setCompletedSubStepCount(item.steps.length);
      setTotalSubStepCount(item.steps.length);
    } else {
      setCompletedSubStepCount(0);
      setTotalSubStepCount(0);
    }
  }, [isMounted, isCompleted, item.id, item.steps, hasSteps]);


  const handleCheckboxChange = () => {
    onToggleComplete(item.id);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[role="checkbox"]') || target.closest('button') || target.closest('a')) {
      return;
    }

    if (hasSteps) {
      router.push(`/task/${item.id}`);
    } else {
      onToggleComplete(item.id);
    }
  };

  const cardClassName = `
    mb-4 shadow-lg transition-all duration-300 ease-in-out 
    ${isCompleted ? 'opacity-70 ring-2 ring-success' : 'hover:shadow-xl hover:scale-[1.01]'}
    ${hasSteps || !isCompleted ? 'cursor-pointer' : ''} 
  `;

  return (
    <Card 
      className={cardClassName.trim()}
      onClick={handleCardClick}
    >
      <CardHeader className="flex flex-row items-start space-x-4 p-4 sm:p-6">
        {Icon && <Icon className={`h-8 w-8 sm:h-10 sm:w-10 ${isCompleted ? 'text-success' : 'text-primary'} mt-1 shrink-0`} aria-hidden="true" />}
        <div className="flex-grow">
          <CardTitle className="font-headline text-lg sm:text-xl">{item.name}</CardTitle>
        </div>
        <Checkbox
          id={`task-${item.id}`}
          checked={isCompleted}
          onCheckedChange={handleCheckboxChange}
          aria-labelledby={`task-title-${item.id}`}
          className="h-6 w-6 sm:h-7 sm:w-7 mt-1 shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground"
        />
      </CardHeader>
      {!isCompleted && (
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-5">
          <CardDescription id={`task-title-${item.id}`} className="text-sm sm:text-base leading-relaxed">
            {item.text}
          </CardDescription>
          {hasSteps && totalSubStepCount > 0 && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs font-medium text-muted-foreground">
                <span>Steps</span>
                <span>{completedSubStepCount} of {totalSubStepCount}</span>
              </div>
              <Progress 
                value={totalSubStepCount > 0 ? (completedSubStepCount / totalSubStepCount) * 100 : 0} 
                className="h-2 [&>div]:bg-accent" 
                aria-label={`Steps: ${completedSubStepCount} of ${totalSubStepCount} steps completed`}
              />
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
