
'use client';

import type { ChecklistItem as ChecklistItemType } from '@/types';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggleTopLevelComplete: (id: string, isChecked: boolean) => void;
  isTopLevelTaskCompleted: boolean;
}

export function ChecklistItem({ item, onToggleTopLevelComplete, isTopLevelTaskCompleted }: ChecklistItemProps) {
  const router = useRouter();
  const IconComponent = item.icon;

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      onToggleTopLevelComplete(item.id, checked);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[role="checkbox"]') || target.closest('label[for^="task-checkbox-"]')) {
      return;
    }
    if (item.slug) {
      router.push(`/${item.slug}`);
    }
  };

  const cardClassName = `
    mb-4 shadow-lg transition-all duration-300 ease-in-out
    ${isTopLevelTaskCompleted ? 'opacity-70 ring-2 ring-success' : 'hover:shadow-xl hover:scale-[1.01]'}
    ${item.slug ? 'cursor-pointer' : ''}
  `;

  return (
    <Card
      className={cardClassName.trim()}
      onClick={item.slug ? handleCardClick : undefined}
      aria-label={item.name || (item.texts && item.texts.length > 0 ? item.texts[0] : 'Task item')}
    >
      <CardHeader className="flex flex-row items-center space-x-4 p-4 sm:p-6">
        {IconComponent && (
          <IconComponent
            className={`h-8 w-8 sm:h-10 sm:w-10 ${isTopLevelTaskCompleted ? 'text-success' : 'text-primary'} shrink-0`}
            aria-hidden="true"
          />
        )}
        {/* Fallback for when icon is null but space is desired, or as a visual debug */}
        {!IconComponent && <div className="h-8 w-8 sm:h-10 sm:w-10 bg-muted/20 rounded shrink-0" />}

        <div className="flex-grow">
          <CardTitle className="font-headline text-lg sm:text-xl" id={`task-title-${item.id}`}>
            {item.name || 'Unnamed Task'}
          </CardTitle>
        </div>
        <Checkbox
          id={`task-checkbox-${item.id}`}
          checked={isTopLevelTaskCompleted}
          onCheckedChange={handleCheckboxChange}
          aria-labelledby={`task-title-${item.id}`}
          className="h-6 w-6 sm:h-7 sm:w-7 shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground"
        />
      </CardHeader>

      {/* Render CardContent for description if texts are available and task is not completed */}
      {item.texts && item.texts.length > 0 && !isTopLevelTaskCompleted && (
         <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-5 sm:pt-0">
           <CardDescription className="text-sm sm:text-base leading-relaxed">
             {item.texts[0]}
           </CardDescription>
         </CardContent>
       )}
    </Card>
  );
}

    