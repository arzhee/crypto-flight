
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { ChecklistItem as ChecklistItemType, TaskStep } from '@/types';
import { initialChecklistItems as allAppChecklistItems } from '@/constants/checklistData';
import { LOCAL_STORAGE_KEY_MAIN_TASKS, LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX } from '@/constants/storageKeys';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';
import NextImage from 'next/image';
import { AppHeader } from '@/components/crypto-pilot/AppHeader';
import { CryptoPilotProgressBar } from '@/components/crypto-pilot/ProgressBar';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AppFooter } from '@/components/layout';

const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
      videoId = urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      videoId = urlObj.pathname.split('/embed/')[1];
    }
  } catch (e) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      videoId = match[2];
    }
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

interface StepCompletionState {
  [stepId: string]: boolean;
}

const formatStepText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\[(\d+)\]/g, '<sup>$1</sup>')
    .replace(/'([^']*)'/g, '<strong>$1</strong>');
};

const formatCitation = (text: string): string => {
  if (!text) return '';
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)(.*)/;
  const match = text.match(markdownLinkRegex);
  if (match) {
    const linkText = match[1];
    const url = match[2];
    const suffix = match[3] || '';
    const escapeHtml = (unsafe: string) => 
      unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${escapeHtml(linkText)}</a>${escapeHtml(suffix)}`;
  }
  return text; 
};

interface TaskStepImageProps {
  imageUrl: string;
  altText: string;
  onImageClick: (imageUrlFromStepImage: string, event: React.MouseEvent) => void;
  priority: boolean;
  aiHint: string;
}

const TaskStepImage: React.FC<TaskStepImageProps> = ({ imageUrl, altText, onImageClick, priority, aiHint }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className="relative w-full max-w-[300px] aspect-[3/2] rounded-md overflow-hidden shadow-md cursor-pointer bg-muted/30"
      onClick={(e) => onImageClick(imageUrl, e)}
      data-image-zoomable="true"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 z-10">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
      <NextImage
        src={imageUrl}
        alt={altText}
        fill
        style={{ objectFit: 'cover' }}
        className={`rounded-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        sizes="(max-width: 640px) 100vw, 300px"
        priority={priority}
        data-ai-hint={aiHint}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} 
      />
    </div>
  );
};


export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = typeof params.id === 'string' ? params.id : undefined;

  const [task, setTask] = useState<ChecklistItemType | null>(null);
  const [stepCompletions, setStepCompletions] = useState<StepCompletionState>({});
  const [allStepsMarked, setAllStepsMarked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [completedTaskCount, setCompletedTaskCount] = useState(0);
  const [totalTaskCount, setTotalTaskCount] = useState(0);

  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentStepImages, setCurrentStepImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [imageAnimationClass, setImageAnimationClass] = useState('');
  const [isImageAnimating, setIsImageAnimating] = useState(false);
  const animationDuration = 300; 

  const touchStartXRef = useRef(0);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && taskId) {
      const foundTask = allAppChecklistItems.find(item => item.id === taskId);
      if (foundTask) {
        setTask(foundTask);
        try {
          const storedStepCompletionsJSON = localStorage.getItem(`${LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX}${taskId}`);
          let initialCompletions: StepCompletionState = {};

          if (storedStepCompletionsJSON) {
            initialCompletions = JSON.parse(storedStepCompletionsJSON) as StepCompletionState;
            (foundTask.steps || []).forEach(step => {
                if (!(step.id in initialCompletions) || typeof initialCompletions[step.id] !== 'boolean') {
                    initialCompletions[step.id] = step.completed;
                }
            });
          } else {
            (foundTask.steps || []).forEach(step => {
              initialCompletions[step.id] = step.completed;
            });
          }
          setStepCompletions(initialCompletions);
        } catch (error) {
          console.error("Failed to load step completions from local storage:", error);
          const initialCompletionsOnError: StepCompletionState = {};
          (foundTask.steps || []).forEach(step => {
            initialCompletionsOnError[step.id] = step.completed;
          });
          setStepCompletions(initialCompletionsOnError);
        }
      } else {
        router.push('/'); 
      }

      try {
        const storedCompletedIdsJSON = localStorage.getItem(LOCAL_STORAGE_KEY_MAIN_TASKS);
        const completedIds = storedCompletedIdsJSON ? JSON.parse(storedCompletedIdsJSON) as string[] : [];
        setCompletedTaskCount(completedIds.length);
        setTotalTaskCount(allAppChecklistItems.length);
      } catch (error) {
        console.error("Failed to load main task progress from local storage:", error);
        setTotalTaskCount(allAppChecklistItems.length); 
      }
    }
  }, [taskId, router, isMounted]);


  useEffect(() => {
    if (isMounted && task && task.steps && task.steps.length > 0) {
      const allMarked = task.steps.every(step => stepCompletions[step.id]);
      setAllStepsMarked(allMarked);
      if (Object.keys(stepCompletions).length > 0) {
        try {
          localStorage.setItem(`${LOCAL_STORAGE_KEY_SUB_TASKS_PREFIX}${task.id}`, JSON.stringify(stepCompletions));
        } catch (error) {
          console.error("Failed to save step completions to local storage:", error);
        }
      }
    } else if (task && (!task.steps || task.steps.length === 0)) {
      setAllStepsMarked(true); 
    } else {
      setAllStepsMarked(false);
    }
  }, [stepCompletions, task, isMounted]);

  const handleToggleStep = useCallback((stepId: string) => {
    setStepCompletions(prev => {
      const newCompletions = {
        ...prev,
        [stepId]: !prev[stepId],
      };
      return newCompletions;
    });
  }, []);

  const onStepDivClick = (e: React.MouseEvent<HTMLDivElement>, stepId: string) => {
    const target = e.target as HTMLElement;
    if (target.closest(`#step-${stepId}`) || target.closest(`label[for='step-${stepId}']`)) {
      return; 
    }
    if (target.closest('[data-image-zoomable="true"]')) {
        return;
    }
    handleToggleStep(stepId);
  };

  const handleImageClick = (clickedImageUrl: string, stepId: string, imageIndexInStepArray: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const currentTaskStep = task?.steps?.find(s => s.id === stepId);
    const imagesForStep = currentTaskStep?.images || [];
    
    setCurrentStepImages(imagesForStep);
    setCurrentImageIndex(imageIndexInStepArray);
    setZoomedImageUrl(clickedImageUrl);
    setImageAnimationClass(''); 
    setIsImageModalOpen(true);
  };
  
  const handlePrevImage = useCallback(() => {
    if (!currentStepImages || currentStepImages.length <= 1 || isImageAnimating) return;
    setIsImageAnimating(true);
    setImageAnimationClass('animate-slide-out-right');

    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex - 1 + currentStepImages.length) % currentStepImages.length;
        setZoomedImageUrl(currentStepImages[newIndex]);
        setImageAnimationClass('animate-slide-in-from-left');
        return newIndex;
      });
      setTimeout(() => {
        setImageAnimationClass('');
        setIsImageAnimating(false);
      }, animationDuration);
    }, animationDuration);
  }, [currentStepImages, isImageAnimating, animationDuration]);
  
  const handleNextImage = useCallback(() => {
    if (!currentStepImages || currentStepImages.length <= 1 || isImageAnimating) return;
    setIsImageAnimating(true);
    setImageAnimationClass('animate-slide-out-left');

    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % currentStepImages.length;
        setZoomedImageUrl(currentStepImages[newIndex]);
        setImageAnimationClass('animate-slide-in-from-right');
        return newIndex;
      });
      setTimeout(() => {
        setImageAnimationClass('');
        setIsImageAnimating(false);
      }, animationDuration);
    }, animationDuration);
  }, [currentStepImages, isImageAnimating, animationDuration]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isImageAnimating || (currentStepImages && currentStepImages.length <= 1)) return;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === 0 || isImageAnimating || (currentStepImages && currentStepImages.length <= 1)) {
      return;
    }
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;
    const swipeThreshold = 50; // Minimum distance for a swipe

    if (deltaX > swipeThreshold) {
      handleNextImage();
    } else if (deltaX < -swipeThreshold) {
      handlePrevImage();
    }
    touchStartXRef.current = 0; // Reset for next swipe
  };


  const handleCompleteMainTask = () => {
    if (task && isMounted) {
      try {
        const storedCompletedIdsJSON = localStorage.getItem(LOCAL_STORAGE_KEY_MAIN_TASKS);
        let completedIdsSet = new Set(storedCompletedIdsJSON ? JSON.parse(storedCompletedIdsJSON) as string[] : []);
        
        if (!completedIdsSet.has(task.id)) { 
          completedIdsSet.add(task.id);
          localStorage.setItem(LOCAL_STORAGE_KEY_MAIN_TASKS, JSON.stringify(Array.from(completedIdsSet)));
          setCompletedTaskCount(completedIdsSet.size); 
        }
        router.push('/');
      } catch (error) {
        console.error("Failed to update task completion in local storage:", error);
      }
    }
  };

  if (!isMounted || !task) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <p className="text-foreground">Loading task details...</p>
      </div>
    );
  }

  const { Icon } = task;
  const isMainTaskCompleted = isMounted && (localStorage.getItem(LOCAL_STORAGE_KEY_MAIN_TASKS) || '').includes(task.id);

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-2xl">
        <AppHeader />
        <CryptoPilotProgressBar currentStep={completedTaskCount} totalSteps={totalTaskCount} />
        
        <Card className="shadow-xl w-full mt-6 flex flex-col max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-12rem)]">
          <CardHeader className="flex flex-row items-start space-x-4 p-4 sm:p-6">
            {Icon && <Icon className={`h-10 w-10 ${isMainTaskCompleted ? 'text-success' : 'text-primary'} mt-1 shrink-0`} aria-hidden="true" />}
            <div className="flex-grow">
              <CardTitle className="font-headline text-xl sm:text-2xl">{task.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-3 sm:px-6 sm:pb-4 flex-grow overflow-y-auto">
            {task.text && (
              <CardDescription className="text-sm sm:text-base mt-1 mb-4">
                {task.text}
              </CardDescription>
            )}
            {(task.steps && task.steps.length > 0) ? (
              <>
                <div className="space-y-4">
                  {task.steps.map((step) => {
                    const primaryStepText = step.texts && step.texts.length > 0 ? step.texts[0] : '';
                    const ariaLabelText = primaryStepText || 'Step instruction';

                    return (
                      <div 
                        key={step.id} 
                        className="flex flex-col p-3 bg-muted/50 dark:bg-muted/30 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={(e) => onStepDivClick(e, step.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id={`step-${step.id}`}
                            checked={!!stepCompletions[step.id]}
                            onCheckedChange={() => handleToggleStep(step.id)}
                            className="mt-1 h-5 w-5 border-primary data-[state=checked]:bg-primary focus:ring-primary"
                            aria-label={ariaLabelText}
                          />
                          <label 
                            htmlFor={`step-${step.id}`} 
                            className="flex-grow text-sm text-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formatStepText(primaryStepText) }}
                          />
                        </div>
                        
                        <div className="pl-8">
                          {step.texts && step.texts.length > 1 && (
                            <div className="mt-2 space-y-1 text-sm text-foreground">
                              {step.texts.slice(1).map((additionalText, index) => (
                                <p key={`${step.id}-additional-${index}`} dangerouslySetInnerHTML={{ __html: formatStepText(additionalText) }} />
                              ))}
                            </div>
                          )}
                          
                          {step.videos && step.videos.length > 0 && (
                            <div className="mt-3 space-y-3">
                              {step.videos.map((videoUrl, index) => {
                                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                                return embedUrl ? (
                                  <div key={`${step.id}-video-${index}`} className="aspect-video w-full">
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      src={embedUrl}
                                      title="YouTube video player"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      className="rounded-md shadow-md"
                                    ></iframe>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          )}

                          {step.images && step.images.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center sm:place-items-start">
                              {step.images.map((imageUrl, index) => {
                                let aiHintForImage = imageUrl.startsWith('https://placehold.co') ? "placeholder image" : "task illustration";
                                return (
                                  <TaskStepImage
                                    key={`${step.id}-image-${index}`}
                                    imageUrl={imageUrl}
                                    altText={`Step image ${index + 1}`}
                                    onImageClick={(imgUrl, e) => handleImageClick(imgUrl, step.id, index, e)}
                                    priority={index < 2}
                                    aiHint={aiHintForImage}
                                  />
                                );
                              })}
                            </div>
                          )}

                          {step.notes && step.notes.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {step.notes.map((note, noteIndex) => (
                                 <Alert key={`${step.id}-note-${noteIndex}`} className="border-primary/50 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 text-xs">
                                  <Info className="h-4 w-4 text-primary dark:text-primary-foreground/90" />
                                  <AlertDescription className="leading-relaxed">
                                    {note.toUpperCase().startsWith("NOTE:") ? note.substring(5).trim() : note}
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          )}

                          {step.cites && step.cites.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-muted/30">
                              <ul className="list-none pl-0 space-y-1">
                                {step.cites.map((cite, citeIndex) => (
                                  <li 
                                    key={`${step.id}-cite-${citeIndex}`} 
                                    className="text-xs text-muted-foreground leading-relaxed"
                                  >
                                    {citeIndex + 1}. <span dangerouslySetInnerHTML={{ __html: formatCitation(cite) }} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">This task has no specific steps to check off here. You can mark it complete using the button below.</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-3 px-4 py-4 sm:px-6 sm:pb-5 border-t">
            <Button variant="link" onClick={() => router.back()} className="hover:no-underline">
              Go back
            </Button>
            <Button
              onClick={handleCompleteMainTask}
              disabled={!allStepsMarked}
              className="bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent disabled:opacity-60"
            >
              Complete task
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-2 sm:p-4 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
          <DialogTitle className="sr-only">Zoomed Task Image</DialogTitle>
          {zoomedImageUrl && currentStepImages && currentStepImages.length > 0 && (
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {currentStepImages.length > 1 && (
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
                  alt={`Zoomed task image ${currentImageIndex + 1} of ${currentStepImages.length}`}
                  className={`max-w-full max-h-[80vh] object-contain rounded-md shadow-lg ${imageAnimationClass}`}
                  draggable="false" 
              />
              {currentStepImages.length > 1 && (
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
          {currentStepImages && currentStepImages.length > 1 && zoomedImageUrl && (
            <div className="absolute bottom-2 sm:bottom-4 text-center text-xs sm:text-sm text-foreground/80 bg-background/70 px-2 py-1 rounded-md">
              {currentImageIndex + 1} / {currentStepImages.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AppFooter />
    </main>
  );
}

