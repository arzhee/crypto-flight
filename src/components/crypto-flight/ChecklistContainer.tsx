
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ChecklistItem as ChecklistItemType } from '@/types';
import { initialChecklistItems, getAllTaskIds } from '@/constants/checklistData';
import { LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED, LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE } from '@/constants/storageKeys';
import { CryptoFlightProgressBar } from './ProgressBar';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Confetti from 'react-confetti';
import { RecursiveChecklistItem } from './RecursiveChecklistItem';
import { useRouter } from 'next/navigation';

const SESSION_STORAGE_COMPLETION_MODAL_SHOWN = 'cryptoFlightCompletionModalShownThisSession';

export function ChecklistContainer() {
  const router = useRouter();
  const [checklistData] = useState<ChecklistItemType[]>(initialChecklistItems);
  const [completedTopLevelTasks, setCompletedTopLevelTasks] = useState<Set<string>>(new Set());
  const [allTaskItemsCompletion, setAllTaskItemsCompletion] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [windowSize, setWindowSize] = useState<{ width: number | undefined; height: number | undefined }>({ width: undefined, height: undefined });

  useEffect(() => {
    setMounted(true);
    try {
      const storedTopLevelJSON = localStorage.getItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED);
      const initialTopLevelTasksFromStorage = storedTopLevelJSON ? new Set(JSON.parse(storedTopLevelJSON) as string[]) : new Set<string>();
      
      const storedAllItemsJSON = localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE);
      let initialAllItemsCompletion = storedAllItemsJSON ? JSON.parse(storedAllItemsJSON) as Record<string, boolean> : {};

      const seedCompletionStatesRecursive = (tasks: ChecklistItemType[], parentIsStaticallyCompleted = false) => {
        tasks.forEach(task => {
          const isStaticallyCompleted = parentIsStaticallyCompleted || task.completed === true;
          if (!(task.id in initialAllItemsCompletion)) {
            initialAllItemsCompletion[task.id] = isStaticallyCompleted;
          }
          if (task.tasks && task.tasks.length > 0) {
            seedCompletionStatesRecursive(task.tasks, initialAllItemsCompletion[task.id]);
          }
        });
      };
      
      seedCompletionStatesRecursive(initialChecklistItems);

      // Sync completedTopLevelTasks based on the potentially updated initialAllItemsCompletion
      const finalInitialTopLevelTasks = new Set<string>();
      initialChecklistItems.forEach(item => {
        // A top-level task is complete if its entry in allTaskItemsCompletion is true
        // OR if it was in the explicitly stored top-level completions (less likely to be needed with new seeding)
        if (initialAllItemsCompletion[item.id] || initialTopLevelTasksFromStorage.has(item.id)) {
          finalInitialTopLevelTasks.add(item.id);
           // Ensure consistency: if top-level is complete, all its descendants in allTaskItemsCompletion should also be true
           if (initialAllItemsCompletion[item.id]) {
            const descendantIds = getAllTaskIds([item]).filter(id => id !== item.id);
            descendantIds.forEach(descId => initialAllItemsCompletion[descId] = true);
           }
        }
      });
      
      setCompletedTopLevelTasks(finalInitialTopLevelTasks);
      setAllTaskItemsCompletion(initialAllItemsCompletion);
      
      localStorage.setItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED, JSON.stringify(Array.from(finalInitialTopLevelTasks)));
      localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE, JSON.stringify(initialAllItemsCompletion));

    } catch (error) {
      console.error("Failed to load or seed task completion states from local storage:", error);
      setCompletedTopLevelTasks(new Set());
      setAllTaskItemsCompletion({});
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
  }, []); // Run only once on mount to load and seed

  useEffect(() => {
    if (mounted) {
      // Persist states to localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED, JSON.stringify(Array.from(completedTopLevelTasks)));
      localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE, JSON.stringify(allTaskItemsCompletion));

      // Sync completedTopLevelTasks based on allTaskItemsCompletion for accuracy
      // This ensures that if sub-tasks are completed on detail page, parent on main page reflects this
      const newTopLevelCompletedFromAllItems = new Set<string>();
      let derivedTopLevelChanged = false;

      initialChecklistItems.forEach(item => {
        // A top-level item is considered complete if its corresponding entry in allTaskItemsCompletion is true.
        // allTaskItemsCompletion[item.id] should be the source of truth, updated by detail page logic.
        if (allTaskItemsCompletion[item.id]) {
          newTopLevelCompletedFromAllItems.add(item.id);
        }
      });
      
      // Compare and update completedTopLevelTasks if different from what's derived from allTaskItemsCompletion
      if (newTopLevelCompletedFromAllItems.size !== completedTopLevelTasks.size ||
          !Array.from(newTopLevelCompletedFromAllItems).every(id => completedTopLevelTasks.has(id))) {
        setCompletedTopLevelTasks(newTopLevelCompletedFromAllItems);
        derivedTopLevelChanged = true; // Mark that a change occurred due to derivation
      }


      // Confetti logic - based on the most up-to-date completedTopLevelTasks
      // If derivedTopLevelChanged is true, use newTopLevelCompletedFromAllItems for this check, otherwise completedTopLevelTasks
      const currentEffectiveTopLevelTasks = derivedTopLevelChanged ? newTopLevelCompletedFromAllItems : completedTopLevelTasks;
      const allTopLevelTasksActuallyCompleted = checklistData.length > 0 && 
        checklistData.every(item => currentEffectiveTopLevelTasks.has(item.id));
      
      if (allTopLevelTasksActuallyCompleted) {
          const modalAlreadyShownThisSession = sessionStorage.getItem(SESSION_STORAGE_COMPLETION_MODAL_SHOWN);
          if (modalAlreadyShownThisSession !== 'true') {
              setShowCompletionModal(true);
              sessionStorage.setItem(SESSION_STORAGE_COMPLETION_MODAL_SHOWN, 'true');
          }
      } else {
          setShowCompletionModal(false);
          sessionStorage.removeItem(SESSION_STORAGE_COMPLETION_MODAL_SHOWN);
      }

    }
  }, [allTaskItemsCompletion, completedTopLevelTasks, mounted, checklistData, initialChecklistItems]);


  const handleToggleMainTaskComplete = useCallback((taskId: string, isChecked: boolean) => {
    // This function is called when a top-level task's own checkbox (either left or right side) is clicked on the main page.
    setCompletedTopLevelTasks(prev => {
      const newCompleted = new Set(prev);
      if (isChecked) {
        newCompleted.add(taskId);
      } else {
        newCompleted.delete(taskId);
      }
      return newCompleted;
    });

    setAllTaskItemsCompletion(prevAll => {
      const newAll = { ...prevAll };
      const taskToUpdate = initialChecklistItems.find(item => item.id === taskId);
      // getAllTaskIds includes the parent task ID itself and all its descendants.
      const idsToUpdate = taskToUpdate ? getAllTaskIds([taskToUpdate]) : [taskId]; 
      
      idsToUpdate.forEach(id => {
        newAll[id] = isChecked;
      });
      return newAll;
    });
  }, [initialChecklistItems]);

  const handleNavigate = useCallback((slug: string) => {
    router.push(`/${slug}`);
  }, [router]);

  const completedCount = completedTopLevelTasks.size;
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
        {[...Array(initialChecklistItems.length || 11)].map((_, i) => (
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
      <div className="my-6">
        <CryptoFlightProgressBar currentStep={completedCount} totalSteps={totalCount} />
      </div>

      <div>
        {checklistData.map((item) => (
          <RecursiveChecklistItem
            key={item.id}
            task={item}
            isCompleted={completedTopLevelTasks.has(item.id)} // This drives the checked state of both left & right checkboxes on main page
            onToggleCompletion={handleToggleMainTaskComplete} // This is called by both left & right checkboxes
            onImageZoom={() => {}} 
            taskCompletionStates={allTaskItemsCompletion} 
            level={0}
            displayContext="mainPage"
            onNavigate={handleNavigate}
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
