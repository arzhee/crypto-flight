
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ChecklistItem as ChecklistItemType } from '@/types';
import { initialChecklistItems } from '@/constants/checklistData';
import { LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED, LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE } from '@/constants/storageKeys';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppHeader } from '@/components/crypto-flight/AppHeader';
import { CryptoFlightProgressBar } from '@/components/crypto-flight/ProgressBar';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AppFooter } from '@/components/layout';
import { RecursiveChecklistItem } from '@/components/crypto-flight/RecursiveChecklistItem';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getAllTaskIdsRecursive = (tasks: ChecklistItemType[]): string[] => {
  let ids: string[] = [];
  for (const task of tasks) {
    ids.push(task.id);
    if (task.tasks && task.tasks.length > 0) {
      ids = ids.concat(getAllTaskIdsRecursive(task.tasks));
    }
  }
  return ids;
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskSlug = typeof params.slug === 'string' ? params.slug : undefined;

  const [mainTask, setMainTask] = useState<ChecklistItemType | null>(null);
  const [taskCompletionStates, setTaskCompletionStates] = useState<Record<string, boolean>>({});
  const [isMounted, setIsMounted] = useState(false);
  const [completedTopLevelTaskCount, setCompletedTopLevelTaskCount] = useState(0);
  const [totalTopLevelTaskCount, setTotalTopLevelTaskCount] = useState(0);
  
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentModalImages, setCurrentModalImages] = useState<string[]>([]);
  const [currentImageIndexInModal, setCurrentImageIndexInModal] = useState<number>(0);
  const [imageAnimationClass, setImageAnimationClass] = useState('');
  const [isImageAnimating, setIsImageAnimating] = useState(false);
  const animationDuration = 300;
  const touchStartXRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && taskSlug) {
      const foundTask = initialChecklistItems.find(item => item.slug === taskSlug);
      if (foundTask) {
        setMainTask(foundTask);
        try {
          const storedAllItemsJSON = localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE);
          let initialCompletions = storedAllItemsJSON ? JSON.parse(storedAllItemsJSON) as Record<string, boolean> : {};

          const seedCompletionStatesRecursive = (task: ChecklistItemType) => {
            if (!(task.id in initialCompletions)) {
              initialCompletions[task.id] = task.completed === true;
            }
            if (task.tasks && task.tasks.length > 0) {
              task.tasks.forEach(subTask => seedCompletionStatesRecursive(subTask));
            }
          };
          seedCompletionStatesRecursive(foundTask);
          setTaskCompletionStates(initialCompletions);
          localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE, JSON.stringify(initialCompletions));

        } catch (error) {
          console.error("Failed to load or seed task completion states from local storage:", error);
          const fallbackCompletions: Record<string, boolean> = {};
          const initializeFallbackRecursive = (task: ChecklistItemType) => {
            fallbackCompletions[task.id] = task.completed === true;
            if (task.tasks) {
              task.tasks.forEach(sub => initializeFallbackRecursive(sub));
            }
          };
          initializeFallbackRecursive(foundTask);
          setTaskCompletionStates(fallbackCompletions);
        }
      } else {
        router.push('/');
      }

      try {
        const storedTopLevelJSON = localStorage.getItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED);
        const completedIds = storedTopLevelJSON ? JSON.parse(storedTopLevelJSON) as string[] : [];
        setCompletedTopLevelTaskCount(completedIds.length);
        setTotalTopLevelTaskCount(initialChecklistItems.length);
      } catch (error) {
        console.error("Failed to load main task progress from local storage:", error);
        setTotalTopLevelTaskCount(initialChecklistItems.length);
      }
    }
  }, [taskSlug, router, isMounted]);

  useEffect(() => {
    if (isMounted && Object.keys(taskCompletionStates).length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE, JSON.stringify(taskCompletionStates));
      } catch (error) {
        console.error("Failed to save task completion states to local storage:", error);
      }
    }
  }, [taskCompletionStates, isMounted]);

  const findTaskByIdRecursive = (tasks: ChecklistItemType[], id: string): ChecklistItemType | null => {
    for (const task of tasks) {
      if (task.id === id) return task;
      if (task.tasks) {
        const found = findTaskByIdRecursive(task.tasks, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const findParentIdRecursive = (tasks: ChecklistItemType[], childId: string, parentId: string | null = null): string | null => {
    for (const task of tasks) {
        if (task.id === childId) return parentId;
        if (task.tasks) {
            const foundParentId = findParentIdRecursive(task.tasks, childId, task.id);
            if (foundParentId) return foundParentId;
        }
    }
    return null;
  };

  const handleToggleTaskCompletion = useCallback((taskId: string, isChecked: boolean) => {
    setTaskCompletionStates(prevStates => {
      const newStates = { ...prevStates };
      
      const updateChildrenRecursive = (currentTaskId: string, checkedStatus: boolean) => {
        newStates[currentTaskId] = checkedStatus;
        const currentTask = findTaskByIdRecursive(initialChecklistItems, currentTaskId); // Use all items for lookup
        if (currentTask && currentTask.tasks) {
          currentTask.tasks.forEach(child => updateChildrenRecursive(child.id, checkedStatus));
        }
      };
      
      updateChildrenRecursive(taskId, isChecked);

      const updateParentRecursive = (currentTaskId: string) => {
        const parentId = findParentIdRecursive(initialChecklistItems, currentTaskId); // Use all items for lookup
        if (parentId) {
            const parentTask = findTaskByIdRecursive(initialChecklistItems, parentId); // Use all items for lookup
            if (parentTask && parentTask.tasks) {
                const allSiblingsCompleted = parentTask.tasks.every(sibling => newStates[sibling.id]);
                if(newStates[parentId] !== allSiblingsCompleted) {
                    newStates[parentId] = allSiblingsCompleted;
                    updateParentRecursive(parentId); 
                }
            }
        }
      };
      updateParentRecursive(taskId);
      
      return newStates;
    });
  }, []);


  const handleCompleteMainTaskAndGoHome = () => {
    if (mainTask && isMounted) {
      try {
        const updatedAllStates = { ...taskCompletionStates };
        const allIdsInTree = getAllTaskIdsRecursive([mainTask]);
        allIdsInTree.forEach(id => updatedAllStates[id] = true);
        localStorage.setItem(LOCAL_STORAGE_KEY_ALL_TASK_ITEMS_COMPLETION_STATE, JSON.stringify(updatedAllStates));
        setTaskCompletionStates(updatedAllStates);

        const storedTopLevelJSON = localStorage.getItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED);
        let topLevelCompletedSet = new Set(storedTopLevelJSON ? JSON.parse(storedTopLevelJSON) as string[] : []);
        topLevelCompletedSet.add(mainTask.id);
        localStorage.setItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED, JSON.stringify(Array.from(topLevelCompletedSet)));
        
        setCompletedTopLevelTaskCount(topLevelCompletedSet.size);

        router.push('/');
      } catch (error) {
        console.error("Failed to update task completion for navigation:", error);
      }
    }
  };
  
  const handleImageZoom = useCallback((imageUrl: string, allImagesInStep: string[], startIndex: number) => {
    setCurrentModalImages(allImagesInStep);
    setCurrentImageIndexInModal(startIndex);
    setZoomedImageUrl(imageUrl);
    setImageAnimationClass('');
    setIsImageModalOpen(true);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (!currentModalImages || currentModalImages.length <= 1 || isImageAnimating) return;
    setIsImageAnimating(true);
    setImageAnimationClass('animate-slide-out-right');
    setTimeout(() => {
      setCurrentImageIndexInModal((prevIndex) => {
        const newIndex = (prevIndex - 1 + currentModalImages.length) % currentModalImages.length;
        setZoomedImageUrl(currentModalImages[newIndex]);
        setImageAnimationClass('animate-slide-in-from-left');
        return newIndex;
      });
      setTimeout(() => {
        setImageAnimationClass('');
        setIsImageAnimating(false);
      }, animationDuration);
    }, animationDuration);
  }, [currentModalImages, isImageAnimating, animationDuration]);

  const handleNextImage = useCallback(() => {
    if (!currentModalImages || currentModalImages.length <= 1 || isImageAnimating) return;
    setIsImageAnimating(true);
    setImageAnimationClass('animate-slide-out-left');
    setTimeout(() => {
      setCurrentImageIndexInModal((prevIndex) => {
        const newIndex = (prevIndex + 1) % currentModalImages.length;
        setZoomedImageUrl(currentModalImages[newIndex]);
        setImageAnimationClass('animate-slide-in-from-right');
        return newIndex;
      });
      setTimeout(() => {
        setImageAnimationClass('');
        setIsImageAnimating(false);
      }, animationDuration);
    }, animationDuration);
  }, [currentModalImages, isImageAnimating, animationDuration]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isImageAnimating || (currentModalImages && currentModalImages.length <= 1)) return;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === 0 || isImageAnimating || (currentModalImages && currentModalImages.length <= 1)) {
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;
    const swipeThreshold = 50; 

    if (deltaX > swipeThreshold) {
      handleNextImage();
    } else if (deltaX < -swipeThreshold) {
      handlePrevImage();
    }
    touchStartXRef.current = 0; 
  };

  if (!isMounted || !mainTask) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <p className="text-foreground">Loading task details...</p>
      </div>
    );
  }

  const MainIcon = mainTask.icon;
  const isThisMainTaskMarkedCompleteInTopLevelStorage = isMounted && (localStorage.getItem(LOCAL_STORAGE_KEY_TOP_LEVEL_TASKS_COMPLETED) || '').includes(mainTask.id);

  const areAllDisplayableTasksCompleted = () => {
    if (!mainTask) return false;
    if (mainTask.tasks && mainTask.tasks.length > 0) {
      return mainTask.tasks.every(subTask => !!taskCompletionStates[subTask.id]);
    }
    // If no sub-tasks, the main task itself must be completed
    return !!taskCompletionStates[mainTask.id];
  };
  const allVisibleTasksCompleted = areAllDisplayableTasksCompleted();


  const hasDetailedContent = (task: ChecklistItemType) => {
    return (task.videos && task.videos.length > 0) ||
           (task.images && task.images.length > 0) ||
           (task.notes && task.notes.length > 0) ||
           (task.cites && task.cites.length > 0) ||
           (task.texts && task.texts.length > (task.name ? 0 : 1)); 
  };


  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-2xl">
        <AppHeader />
        <div className="my-6"> {/* Added wrapper for margin */}
          <CryptoFlightProgressBar currentStep={completedTopLevelTaskCount} totalSteps={totalTopLevelTaskCount} />
        </div>

        <Card className="shadow-xl w-full mt-6 flex flex-col max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-12rem)]">
          <CardHeader className="flex flex-row items-start space-x-4 p-4 sm:p-6">
            {MainIcon && <MainIcon className={`h-10 w-10 ${isThisMainTaskMarkedCompleteInTopLevelStorage ? 'text-success' : 'text-primary'} mt-1 shrink-0`} aria-hidden="true" />}
            <div className="flex-grow">
              <CardTitle className="font-headline text-xl sm:text-2xl">{mainTask.name}</CardTitle>
              {mainTask.texts && mainTask.texts.length > 0 && (
                <CardDescription className="text-sm sm:text-base mt-1">
                  {mainTask.texts[0]}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 sm:px-6 sm:pb-4 flex-grow overflow-y-auto">
            {(mainTask.tasks && mainTask.tasks.length > 0) ? (
              <div className="space-y-4">
                {mainTask.tasks.map((subTask) => (
                  <RecursiveChecklistItem
                    key={subTask.id}
                    task={subTask}
                    isCompleted={!!taskCompletionStates[subTask.id]}
                    onToggleCompletion={handleToggleTaskCompletion}
                    onImageZoom={handleImageZoom}
                    taskCompletionStates={taskCompletionStates}
                    level={0} 
                    displayContext="detailPage"
                  />
                ))}
              </div>
            ) : hasDetailedContent(mainTask) ? (
                 <RecursiveChecklistItem
                    key={mainTask.id}
                    task={mainTask}
                    isCompleted={!!taskCompletionStates[mainTask.id]}
                    onToggleCompletion={handleToggleTaskCompletion}
                    onImageZoom={handleImageZoom}
                    taskCompletionStates={taskCompletionStates}
                    level={0}
                    displayContext="detailPage"
                    isStandaloneItem={true} 
                 />
            ) : (
              <p className="text-sm text-muted-foreground">{mainTask.texts && mainTask.texts.length > 1 ? mainTask.texts.slice(1).join(' ') : "This task has no specific steps. Mark complete below."}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 px-4 py-4 sm:px-6 sm:pb-5 border-t">
            <Button variant="link" onClick={() => router.back()} className="hover:no-underline">
              Go back
            </Button>
            <Button
              onClick={handleCompleteMainTaskAndGoHome}
              disabled={!allVisibleTasksCompleted}
              className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent disabled:opacity-60"
            >
              Complete: {mainTask.name}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-2 sm:p-4 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
          <DialogTitle className="sr-only">Zoomed Task Image</DialogTitle>
          {zoomedImageUrl && currentModalImages && currentModalImages.length > 0 && (
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {currentModalImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/75 text-foreground p-1"
                  onClick={handlePrevImage}
                  disabled={isImageAnimating}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              )}
               <img 
                  src={zoomedImageUrl} 
                  alt={`Zoomed task image ${currentImageIndexInModal + 1} of ${currentModalImages.length}`}
                  className={`max-w-full max-h-[80vh] object-contain rounded-md shadow-lg ${imageAnimationClass}`}
                  draggable="false" 
              />
              {currentModalImages.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-background/50 hover:bg-background/75 text-foreground p-1"
                  onClick={handleNextImage}
                  disabled={isImageAnimating}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              )}
            </div>
          )}
           {currentModalImages && currentModalImages.length > 1 && zoomedImageUrl && (
            <div className="absolute bottom-2 sm:bottom-4 text-center text-xs sm:text-sm text-foreground/80 bg-background/70 px-2 py-1 rounded-md">
              {currentImageIndexInModal + 1} / {currentModalImages.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AppFooter />
    </main>
  );
}
