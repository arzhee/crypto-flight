
'use client';

import type { ChecklistItem as ChecklistItemType } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NextImage from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { CryptoFlightProgressBar } from './ProgressBar';

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
  onImageClick: (imageUrl: string, event: React.MouseEvent) => void;
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
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
        draggable="false"
      />
    </div>
  );
};


interface RecursiveChecklistItemProps {
  task: ChecklistItemType;
  isCompleted: boolean;
  onToggleCompletion: (taskId: string, isChecked: boolean) => void;
  onImageZoom: (imageUrl: string, allImages: string[], startIndex: number) => void;
  taskCompletionStates: Record<string, boolean>;
  level: number;
  displayContext: 'mainPage' | 'detailPage';
  onNavigate?: (slug: string) => void;
  isStandaloneItem?: boolean;
}

export function RecursiveChecklistItem({
  task,
  isCompleted,
  onToggleCompletion,
  onImageZoom,
  taskCompletionStates,
  level,
  displayContext,
  onNavigate,
  isStandaloneItem = false,
}: RecursiveChecklistItemProps) {

  const hasSubTasks = useMemo(() => task.tasks && task.tasks.length > 0, [task.tasks]);

  const isNavigableSubItemOnDetailPage = useMemo(() =>
    displayContext === 'detailPage' &&
    !isStandaloneItem &&
    !!task.slug &&
    hasSubTasks &&
    !!onNavigate
  , [displayContext, isStandaloneItem, task.slug, hasSubTasks, onNavigate]);

  const isMainTaskStyle = useMemo(() =>
    displayContext === 'mainPage' || isNavigableSubItemOnDetailPage
  , [displayContext, isNavigableSubItemOnDetailPage]);

  const isSimpleExpandableDetailItem = useMemo(() =>
    displayContext === 'detailPage' && !isStandaloneItem && !isMainTaskStyle && hasSubTasks
  , [displayContext, isStandaloneItem, isMainTaskStyle, hasSubTasks]);

  const [isExpandedForSimpleDetailItem, setIsExpandedForSimpleDetailItem] = useState(
     () => (isSimpleExpandableDetailItem && (task.tasks?.some(st => !!taskCompletionStates[st.id] && !taskCompletionStates[task.id]) || false)) || (isSimpleExpandableDetailItem && task.completed === undefined && level < 1)
  );

  const ActualIcon = task.icon;

  const taskTitle = useMemo(() =>
    task.name || (task.texts && task.texts.length > 0 ? task.texts[0] : 'Unnamed Task')
  , [task.name, task.texts]);

  // Description to be shown in the header for main-style cards
  const itemDescriptionForHeader = useMemo(() => {
    if (isMainTaskStyle) {
      if (task.name && task.texts && task.texts.length > 0) {
        return task.texts[0];
      }
      if (!task.name && task.texts && task.texts.length > 1) {
        return task.texts[1];
      }
    }
    return null;
  }, [task.name, task.texts, isMainTaskStyle]);


  // Description for the header of non-main-style, expandable items
  const descriptionForSimpleHeader = useMemo(() => {
    if (!isMainTaskStyle && task.name && task.texts && task.texts.length > 0) {
      return task.texts[0];
    }
    return null;
  }, [isMainTaskStyle, task.name, task.texts]);


  const bodyContentTexts = useMemo(() => {
    if (displayContext === 'detailPage' && !isMainTaskStyle && (isExpandedForSimpleDetailItem || !hasSubTasks)) {
        if (task.name && task.texts && task.texts.length > 0) {
            // task.name was title, task.texts[0] was header description
            return task.texts.length > 1 ? task.texts.slice(1) : [];
        } else if (!task.name && task.texts && task.texts.length > 0) {
            // task.texts[0] was title
            return task.texts.length > 1 ? task.texts.slice(1) : [];
        } else if (task.name && (!task.texts || task.texts.length === 0)) {
            // task.name was title, no texts for header description or body
            return [];
        }
        return task.texts || []; // Fallback
    }
    // For standalone items, if name exists, all texts are body. If no name, texts[0] was title, rest are body.
    if (isStandaloneItem) {
      if (task.name || !(task.texts && task.texts.length > 0 && task.texts[0] === taskTitle)) {
        return task.texts || [];
      }
      return task.texts && task.texts.length > 1 ? task.texts.slice(1) : [];
    }
    return [];
  }, [displayContext, isMainTaskStyle, task.name, task.texts, taskTitle, isExpandedForSimpleDetailItem, hasSubTasks, isStandaloneItem]);


  const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-image-zoomable="true"]') ||
        target.closest('a') ||
        target.closest('button.expander-button') ||
        target.closest('iframe') ||
        target.closest('[role="checkbox"]')) {
      return;
    }

    if (task.slug && onNavigate && (isMainTaskStyle || isNavigableSubItemOnDetailPage) ) {
      onNavigate(task.slug);
    } else if (displayContext === 'detailPage' && !isMainTaskStyle) {
      if (isSimpleExpandableDetailItem) {
        setIsExpandedForSimpleDetailItem(prev => !prev);
      } else if (!hasSubTasks) { // Leaf node in detail page, non-main style
        onToggleCompletion(task.id, !isCompleted);
      }
    } else if (isStandaloneItem && !hasSubTasks){ // Standalone leaf node
        onToggleCompletion(task.id, !isCompleted);
    }
  }, [task.id, task.slug, onNavigate, isMainTaskStyle, isNavigableSubItemOnDetailPage, displayContext, isSimpleExpandableDetailItem, hasSubTasks, onToggleCompletion, isCompleted, isStandaloneItem]);


  const handleLeftCheckboxToggle = useCallback(() => {
    onToggleCompletion(task.id, !isCompleted);
  }, [task.id, isCompleted, onToggleCompletion]);

  const handleRightCheckboxToggle = useCallback((checked: boolean) => {
    onToggleCompletion(task.id, checked);
  }, [task.id, onToggleCompletion]);


  const cardBaseClasses = "mb-4 transition-all duration-300 ease-in-out";
  const canBeClickedForAction = (task.slug && onNavigate && (isMainTaskStyle || isNavigableSubItemOnDetailPage)) || (displayContext === 'detailPage' && !isMainTaskStyle && (isSimpleExpandableDetailItem || !hasSubTasks)) || (isStandaloneItem && !hasSubTasks);
  const cursorClasses = canBeClickedForAction ? 'cursor-pointer' : '';

  const cardClassName = useMemo(() => cn(
    cardBaseClasses,
    cursorClasses,
    isMainTaskStyle && (isCompleted ? 'opacity-80 bg-success/10 dark:bg-success/20 ring-1 ring-success/30 shadow-md' : 'bg-card hover:shadow-xl hover:scale-[1.01] shadow-md'),
    !isMainTaskStyle && displayContext === 'detailPage' && (isCompleted ? 'bg-success/10 dark:bg-success/20 shadow-sm' : 'bg-muted/50 dark:bg-muted/30 hover:shadow-md shadow-sm'),
    isStandaloneItem && !isMainTaskStyle && 'bg-card shadow-xl' // Standalone items on detail page get full card look
  ), [cardBaseClasses, cursorClasses, isMainTaskStyle, displayContext, isStandaloneItem, isCompleted]);

  const checkboxSizeClass = 'h-5 w-5 sm:h-6 sm:w-6';
  const iconSizeClass = isMainTaskStyle ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-6 w-6 sm:h-7 sm:w-7';

  const subTaskProgressBarForCurrentItem = useMemo(() => {
    // Only show progress bar for main task style items that have sub-tasks
    if (isMainTaskStyle && hasSubTasks) {
      const subTasks = task.tasks || [];
      const completedSubTaskCount = subTasks.filter(st => !!taskCompletionStates[st.id]).length;
      const totalSubTaskCount = subTasks.length;
      if (totalSubTaskCount > 0) {
        return (
          <div className="mt-3"> {/* Margin top for spacing from description if in header */}
            <div className="mb-1 flex justify-end text-xs text-muted-foreground">
              <span>{completedSubTaskCount} of {totalSubTaskCount} tasks</span>
            </div>
            <CryptoFlightProgressBar
              currentStep={completedSubTaskCount}
              totalSteps={totalSubTaskCount}
              showLabels={false}
            />
          </div>
        );
      }
    }
    return null;
  }, [task.tasks, hasSubTasks, taskCompletionStates, isMainTaskStyle]);


  if (isMainTaskStyle) {
    return (
      <Card className={cardClassName.trim()} onClick={handleCardClick} aria-label={taskTitle} >
        <CardHeader className={cn(
          "flex flex-row items-start space-x-4",
           itemDescriptionForHeader || subTaskProgressBarForCurrentItem ? "p-4 pb-3 sm:p-6 sm:pb-4" : "p-4 sm:p-6"
        )}>
          {ActualIcon && (
            <ActualIcon
              className={cn(
                `shrink-0 mt-1`,
                iconSizeClass,
                isCompleted ? 'text-success' : 'text-primary'
              )}
              aria-hidden="true"
            />
          )}
          <div className="flex-grow">
            <CardTitle className={cn(
              'font-headline font-semibold text-lg sm:text-xl'
            )} id={`task-title-${task.id}`}>
              {taskTitle}
            </CardTitle>
            {itemDescriptionForHeader && (
               <CardDescription className="text-sm sm:text-base leading-relaxed mt-1">
                  {itemDescriptionForHeader}
              </CardDescription>
            )}
          </div>
          {hasSubTasks && ( // Right-side checkbox for main task style if it has sub-tasks
            <Checkbox
                id={`task-main-checkbox-agg-${task.id}`}
                checked={!!isCompleted}
                onCheckedChange={() => handleRightCheckboxToggle(!isCompleted)}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  `ml-auto shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground focus-visible:ring-primary`,
                  checkboxSizeClass
                )}
                aria-label={`Mark task ${taskTitle} and its sub-tasks as complete`}
            />
          )}
        </CardHeader>

        {subTaskProgressBarForCurrentItem && (
          <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-0">
            {subTaskProgressBarForCurrentItem}
          </CardContent>
        )}
      </Card>
    );
  }


  const showContentAreaForSimpleOrStandalone = useMemo(() =>
    (displayContext === 'detailPage' && !isMainTaskStyle && (isExpandedForSimpleDetailItem || !hasSubTasks)) ||
    (isStandaloneItem && (
        (bodyContentTexts.length > 0 || (task.videos && task.videos.length > 0) || (task.images && task.images.length > 0) || (task.notes && task.notes.length > 0) || (task.cites && task.cites.length > 0)) ||
        (!hasSubTasks && !isMainTaskStyle) // If standalone and no subtasks, show content even if empty to allow marking complete
      )
    )
  , [displayContext, isMainTaskStyle, isExpandedForSimpleDetailItem, hasSubTasks, isStandaloneItem, bodyContentTexts, task.videos, task.images, task.notes, task.cites]);

  return (
    <Card
      className={cardClassName.trim()}
      onClick={handleCardClick}
      aria-label={taskTitle}
    >
      <CardHeader className={cn(
          "flex flex-row space-x-3 items-start",
          "p-3 sm:p-4",
           // Add bottom padding if content area will be shown AND if there's header description or it's expandable
          (showContentAreaForSimpleOrStandalone && (descriptionForSimpleHeader || isSimpleExpandableDetailItem)) ? "pb-2 sm:pb-3" : ""
      )}>
         <div className="flex-grow flex items-start space-x-3">
            {(ActualIcon && (isStandaloneItem || (displayContext === 'detailPage' && !isMainTaskStyle && !hasSubTasks && task.icon))) ? (
                 <ActualIcon
                    className={cn(
                    `shrink-0 mt-1`, iconSizeClass,
                    isCompleted ? 'text-success' : 'text-primary'
                    )}
                    aria-hidden="true"
                />
            ) : ( // Left checkbox for simple detail items or standalone items without their own icon displayed this way
                <Checkbox
                    id={`task-checkbox-detail-${task.id}`}
                    checked={!!isCompleted}
                    onCheckedChange={handleLeftCheckboxToggle}
                    onClick={(e) => e.stopPropagation()}
                    aria-labelledby={`task-title-${task.id}`}
                    className={cn(
                        `mt-1 shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground focus-visible:ring-primary`,
                        checkboxSizeClass
                    )}
                />
            )}
            <div className="flex-grow">
                <CardTitle className='font-normal text-base sm:text-lg' id={`task-title-${task.id}`}>
                    {task.name || taskTitle} {/* Prioritize task.name for title if available */}
                </CardTitle>
                {descriptionForSimpleHeader && (
                     <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug">
                        {descriptionForSimpleHeader}
                    </p>
                )}
            </div>
        </div>

        {isSimpleExpandableDetailItem && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpandedForSimpleDetailItem(!isExpandedForSimpleDetailItem);}}
            className="p-1 text-muted-foreground hover:text-foreground expander-button self-center"
            aria-expanded={isExpandedForSimpleDetailItem}
            aria-controls={`task-content-${task.id}`}
          >
            {isExpandedForSimpleDetailItem ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
      </CardHeader>

      {showContentAreaForSimpleOrStandalone && (isExpandedForSimpleDetailItem || !hasSubTasks || isStandaloneItem) && (
        <CardContent
            id={`task-content-${task.id}`}
            className={cn(
                "pl-10 pr-3 pb-3 pt-0 sm:pl-12 sm:pr-4 sm:pb-4", // Base padding
                // Add top padding only if there was actual content to separate from header items
                ( bodyContentTexts.length > 0 ||
                  (task.videos && task.videos.length > 0) ||
                  (task.images && task.images.length > 0) ||
                  (task.notes && task.notes.length > 0) ||
                  (task.cites && task.cites.length > 0) ||
                  (isSimpleExpandableDetailItem && hasSubTasks && isExpandedForSimpleDetailItem)
                ) ? "pt-2 sm:pt-2" : ""
            )}
        >
          {bodyContentTexts.length > 0 && (
            <div className="space-y-1 text-sm text-foreground/90 leading-relaxed">
              {bodyContentTexts.map((text, index) => (
                <p key={`text-${index}`} dangerouslySetInnerHTML={{ __html: formatStepText(text) }} />
              ))}
            </div>
          )}

          {(task.videos && task.videos.length > 0) && (
            <div className="space-y-3">
              {task.videos.map((videoUrl, index) => {
                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                return embedUrl ? (
                  <div key={`video-${index}`} className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title={`YouTube video player for ${taskTitle}`}
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

          {(task.images && task.images.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center sm:place-items-start">
              {task.images.map((imageUrl, index) => (
                <TaskStepImage
                  key={`image-${index}`}
                  imageUrl={imageUrl}
                  altText={`${taskTitle} image ${index + 1}`}
                  onImageClick={(imgUrl, e) => {
                      e.stopPropagation();
                      onImageZoom(imgUrl, task.images || [], index);
                  }}
                  priority={index < 2}
                  aiHint={imageUrl.startsWith('https://placehold.co') ? "placeholder image" : "task illustration"}
                />
              ))}
            </div>
          )}

          {(task.notes && task.notes.length > 0) && (
            <div className="space-y-2">
              {task.notes.map((note, noteIndex) => (
                <Alert key={`note-${noteIndex}`} className="border-primary/50 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 text-xs">
                  <Info className="h-4 w-4 text-primary dark:text-primary-foreground/90" />
                  <AlertDescription className="leading-relaxed">
                    {note.toUpperCase().startsWith("NOTE:") ? note.substring(5).trim() : note}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {(task.cites && task.cites.length > 0) && (
            <div className="mt-4 pt-2 border-t border-muted/30">
              <ul className="list-none pl-0 space-y-1">
                {task.cites.map((cite, citeIndex) => (
                  <li
                    key={`cite-${citeIndex}`}
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {citeIndex + 1}. <span dangerouslySetInnerHTML={{ __html: formatCitation(cite) }} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isSimpleExpandableDetailItem && isExpandedForSimpleDetailItem && task.tasks && task.tasks.length > 0 && (
            <div className="mt-4 space-y-3">
              {task.tasks.map((subTask) => (
                <RecursiveChecklistItem
                  key={subTask.id}
                  task={subTask}
                  isCompleted={!!taskCompletionStates[subTask.id]}
                  onToggleCompletion={onToggleCompletion}
                  onImageZoom={onImageZoom}
                  taskCompletionStates={taskCompletionStates}
                  level={level + 1}
                  displayContext="detailPage"
                  onNavigate={onNavigate}
                  isStandaloneItem={false}
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
