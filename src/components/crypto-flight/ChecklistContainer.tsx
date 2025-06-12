
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ChecklistItem as ChecklistItemType } from '@/types';
import { initialChecklistItems } from '@/constants/checklistData';
import { LOCAL_STORAGE_KEY_MAIN_TASKS, LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX } from '@/constants/storageKeys';
import { ChecklistItem } from './ChecklistItem';
import { CryptoFlightProgressBar } from './ProgressBar';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Confetti from 'react-confetti';

const SESSION_STORAGE_COMPLETION_MODAL_SHOWN = 'cryptoFlightCompletionModalShownThisSession';

export function ChecklistContainer() {
  const [checklistData, setChecklistData] = useState<ChecklistItemType[]>(initialChecklistItems);
  const [completedMainTasks, setCompletedMainTasks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({ width: undefined, height: undefined });

  useEffect(() => {
    setMounted(true);
    try {
      const storedCompletedIdsJSON = localStorage.getItem(LOCAL_STORAGE_KEY_MAIN_TASKS);
      if (storedCompletedIdsJSON) {
        const completedIds = JSON.parse(storedCompletedIdsJSON) as string[];
        setCompletedMainTasks(new Set(completedIds));
      }
    } catch (error) {
      console.error("Failed to load main task completion from local storage:", error);
      setCompletedMainTasks(new Set());
    }

    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_MAIN_TASKS, JSON.stringify(Array.from(completedMainTasks)));
        
        const allTasksNowCompleted = checklistData.length > 0 && checklistData.every(item => completedMainTasks.has(item.id));
        const congratsTaskIsCompleted = completedMainTasks.has('12'); // Assuming '12' is the ID of the "Congratulations" task

        if (allTasksNowCompleted && congratsTaskIsCompleted) {
          const modalAlreadyShownThisSession = sessionStorage.getItem(SESSION_STORAGE_COMPLETION_MODAL_SHOWN);
          if (modalAlreadyShownThisSession !== 'true') {
            setShowCompletionModal(true);
            sessionStorage.setItem(SESSION_STORAGE_COMPLETION_MODAL_SHOWN, 'true');
          }
        } else {
          setShowCompletionModal(false); 
          sessionStorage.removeItem(SESSION_STORAGE_COMPLETION_MODAL_SHOWN);
        }

      } catch (error) {
        console.error("Failed to save main task completions to local storage or manage session storage:", error);
      }
    }
  }, [completedMainTasks, mounted, checklistData]);


  const handleToggleMainTaskComplete = useCallback((id: string) => {
    setCompletedMainTasks(prevCompleted => {
      const newCompleted = new Set(prevCompleted);
      const task = checklistData.find(item => item.id === id);

      if (newCompleted.has(id)) { // Task was completed, now being unchecked
        newCompleted.delete(id);
        if (task && task.steps && task.steps.length > 0) {
          const resetStepCompletions: Record<string, boolean> = {};
          task.steps.forEach(step => {
            resetStepCompletions[step.id] = false;
          });
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX}${id}`, JSON.stringify(resetStepCompletions));
          } catch (error) {
            console.error(`Failed to reset sub-task completions for task ${id} in local storage:`, error);
          }
        }
      } else { // Task was not completed, now being checked
        newCompleted.add(id);
        if (task && task.steps && task.steps.length > 0) {
          const completeStepCompletions: Record<string, boolean> = {};
          task.steps.forEach(step => {
            completeStepCompletions[step.id] = true;
          });
          try {
            localStorage.setItem(`${LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX}${id}`, JSON.stringify(completeStepCompletions));
          } catch (error) {
            console.error(`Failed to set sub-task completions for task ${id} to true in local storage:`, error);
          }
        }
      }
      
      return newCompleted;
    });
  }, [checklistData]); 

  const completedCount = completedMainTasks.size;
  const totalCount = checklistData.length;

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="my-6">
          <div className="mb-2 flex justify-between text-sm font-medium text-foreground">
            <span>Progress</span>
            <span>Loading...</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full" />
        </div>
        {[...Array(12)].map((_, i) => (
          <div key={i} className="mb-4 p-6 bg-card rounded-lg shadow-md animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {showCompletionModal && windowSize.width && windowSize.height && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
          gravity={0.1}
          style={{ zIndex: 100 }}
        />
      )}
      <CryptoFlightProgressBar currentStep={completedCount} totalSteps={totalCount} />
      
      <div>
        {checklistData.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggleComplete={handleToggleMainTaskComplete}
            isInitiallyCompleted={completedMainTasks.has(item.id)}
          />
        ))}
      </div>

      <AlertDialog open={showCompletionModal} onOpenChange={setShowCompletionModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>All Steps Completed!</AlertDialogTitle>
            <AlertDialogDescription>
              Awesome work, CryptoPilot! You've successfully navigated the basics.
              Keep that curiosity flying high!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowCompletionModal(false)}>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
