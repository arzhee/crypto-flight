
'use client';

import type { ChecklistItem as ChecklistItemType } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NextImage from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
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
        onLoadingComplete={() => setIsLoading(false)}
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
  const [isExpanded, setIsExpanded] = useState(
    (displayContext === 'detailPage' && level === 0 && !isStandaloneItem) ||
    (task.tasks && task.tasks.length > 0 && task.tasks.every(st => taskCompletionStates[st.id]))
  );

  const ActualIcon = task.icon;
  const taskTitle = task.name || (task.texts && task.texts.length > 0 ? task.texts[0] : 'Unnamed Task');

  const contentTexts = task.name || !(task.texts && task.texts.length > 0 && task.texts[0] === taskTitle)
    ? task.texts || []
    : (task.texts && task.texts.length > 1 ? task.texts.slice(1) : []);

  const mainPageDescription = displayContext === 'mainPage' && task.name && task.texts && task.texts.length > 0
    ? task.texts[0]
    : null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-image-zoomable="true"]') || target.closest('a') ||
        target.closest('button.expander-button') || target.closest('[role="checkbox"]')) {
      return;
    }

    if (displayContext === 'mainPage' && task.slug && onNavigate) {
      onNavigate(task.slug);
    } else if (displayContext === 'detailPage') {
        onToggleCompletion(task.id, !isCompleted);
    }
  };

  const hasSubTasks = task.tasks && task.tasks.length > 0;
  const hasOwnContent =
    (contentTexts && contentTexts.length > 0) ||
    (task.videos && task.videos.length > 0) ||
    (task.images && task.images.length > 0) ||
    (task.notes && task.notes.length > 0) ||
    (task.cites && task.cites.length > 0);

  const cardBaseClasses = "mb-4 shadow-lg transition-all duration-300 ease-in-out";
  const mainPageClasses = displayContext === 'mainPage' && isCompleted ? 'opacity-70 ring-2 ring-success' : displayContext === 'mainPage' ? 'hover:shadow-xl hover:scale-[1.01]' : '';
  const cursorClasses = (displayContext === 'mainPage' && task.slug) || (displayContext === 'detailPage') ? 'cursor-pointer' : '';
  
  let detailPageSpecificClasses = 'bg-card';
  if (displayContext === 'detailPage') {
    if (isStandaloneItem) {
      detailPageSpecificClasses = 'bg-card'; // Main content for simple task
    } else { // Child/nested tasks
      if (level > 0) { // Nested (level 1+ sub-tasks)
        detailPageSpecificClasses = 'bg-muted/50 dark:bg-muted/30 p-3 rounded-lg shadow-sm hover:shadow-md';
      } else { // Direct child items on detail page (level 0, !isStandaloneItem)
        detailPageSpecificClasses = 'bg-muted/50 dark:bg-muted/30'; // Grey background for FAQ items etc.
      }
    }
  }


  const cardClassName = cn(
    cardBaseClasses,
    mainPageClasses,
    cursorClasses,
    detailPageSpecificClasses
  );
  
  const showContentArea = displayContext === 'detailPage' && (isExpanded || isStandaloneItem) && (hasOwnContent || (hasSubTasks && !isStandaloneItem));

  const checkboxSizeClass = 'h-5 w-5 sm:h-6 sm:w-6';
  const iconSizeClass = displayContext === 'mainPage' ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-6 w-6 sm:h-7 sm:w-7';
  
  const isHeaderItemsStart = displayContext === 'detailPage' && !isStandaloneItem;


  const cardTitleClass = cn(
    'font-headline',
     (displayContext === 'detailPage' && (isHeaderItemsStart || level > 0 || isStandaloneItem || !ActualIcon))
      ? 'font-normal text-base sm:text-lg'
      : 'font-semibold text-lg sm:text-xl'
  );
  
  let headerPaddingClass = 'p-4 sm:p-6'; // Default for main page
  if (displayContext === 'detailPage') {
    if (level > 0 || isStandaloneItem) { // Nested sub-tasks or standalone item content
      headerPaddingClass = 'pb-2 pt-2 pl-3 pr-3 sm:pb-3 sm:pt-3 sm:pl-4 sm:pr-4';
    } else { // Direct child items on detail page (level 0, !isStandaloneItem)
      headerPaddingClass = 'p-4 sm:p-6 pb-3 pt-3';
    }
  }


  let cardContentPaddingClass = "px-4 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-0";
  if (displayContext === 'detailPage') {
    if (level > 0 || isStandaloneItem) {
      cardContentPaddingClass = "pl-10 pr-4 pb-3 pt-3 sm:pl-12 sm:pr-6 sm:pb-4";
    } else if (level === 0 && !isStandaloneItem) {
       if (hasOwnContent) {
          cardContentPaddingClass = "px-4 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-0"; // Explicitly pt-0
       } else if (hasSubTasks) {
          cardContentPaddingClass = "p-4 sm:p-6 pt-0"; // Explicitly pt-0
       }
    }
  }


  return (
    <Card
      className={cardClassName.trim()}
      onClick={handleCardClick}
      aria-label={taskTitle}
    >
      <CardHeader className={cn(
          "flex flex-row space-x-3",
          isHeaderItemsStart ? 'items-start' : 'items-center',
          headerPaddingClass,
          displayContext === 'detailPage' && !isStandaloneItem && isCompleted ? 'bg-success/10 dark:bg-success/20' : ''
      )}>
        <div className={cn("flex-grow flex space-x-3", isHeaderItemsStart ? 'items-start' : 'items-center')}>
            {ActualIcon ? (
            <ActualIcon
                className={cn(
                `shrink-0`,
                iconSizeClass,
                isCompleted ? 'text-success' : 'text-primary',
                isHeaderItemsStart && 'mt-1'
                )}
                aria-hidden="true"
            />
            ) : (
            <Checkbox
                id={`task-checkbox-${task.id}`}
                checked={isCompleted}
                onCheckedChange={(checked) => {
                    onToggleCompletion(task.id, typeof checked === 'boolean' ? checked : false);
                }}
                onClick={(e) => e.stopPropagation()} 
                aria-labelledby={`task-title-${task.id}`}
                className={cn(
                    `shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground focus-visible:ring-primary mt-1`,
                    checkboxSizeClass
                )}
            />
            )}
            <div className="flex-grow">
            <CardTitle className={cardTitleClass} id={`task-title-${task.id}`}>
                {taskTitle}
            </CardTitle>
            </div>
        </div>
        {hasSubTasks && displayContext === 'detailPage' && !isStandaloneItem && (
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded);}}
            className="p-1 text-muted-foreground hover:text-foreground expander-button self-center"
            aria-expanded={isExpanded}
            aria-controls={`task-content-${task.id}`}
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
         {displayContext === 'mainPage' && hasSubTasks && (
            <Checkbox
                id={`task-main-checkbox-agg-${task.id}`}
                checked={isCompleted}
                onCheckedChange={(checkedStatus) => {
                    onToggleCompletion(task.id, typeof checkedStatus === 'boolean' ? checkedStatus : false);
                }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    `ml-auto shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground focus-visible:ring-primary`,
                    checkboxSizeClass 
                )}
                aria-label={`Mark main task ${taskTitle} as complete`}
            />
        )}
      </CardHeader>

      {displayContext === 'mainPage' && (
        (mainPageDescription && !isCompleted) || (hasSubTasks)
        ) && (
        <CardContent className={cardContentPaddingClass}>
          {mainPageDescription && !isCompleted && (
            <CardDescription className="text-sm sm:text-base leading-relaxed">
              {mainPageDescription}
            </CardDescription>
          )}
          
          {hasSubTasks && (
            <div className={cn(mainPageDescription && !isCompleted ? "mt-4" : "mt-0 pt-2")}>
              {(() => {
                const subTasks = task.tasks || [];
                const completedSubTaskCount = subTasks.filter(st => !!taskCompletionStates[st.id]).length;
                const totalSubTaskCount = subTasks.length;
                
                if (totalSubTaskCount > 0) {
                  return (
                    <>
                      <div className="mb-1 flex justify-end text-xs text-muted-foreground">
                        <span>{completedSubTaskCount} of {totalSubTaskCount} tasks</span>
                      </div>
                      <CryptoFlightProgressBar 
                        currentStep={completedSubTaskCount} 
                        totalSteps={totalSubTaskCount}
                        showLabels={false}
                      />
                    </>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </CardContent>
      )}

      {showContentArea && (
        <CardContent
            id={`task-content-${task.id}`}
            className={cn(
                cardContentPaddingClass,
                (level > 0 || isStandaloneItem || (hasSubTasks && !isStandaloneItem && !hasOwnContent)) ? "pt-3" : "",
                isCompleted && !isStandaloneItem ? 'bg-success/10 dark:bg-success/20' : ''
            )}
        >
          {contentTexts && contentTexts.length > 0 && (
            <div className={cn("space-y-1 text-sm text-foreground/90 leading-relaxed", {"mt-2": level === 0 && !isStandaloneItem && !hasOwnContent && hasSubTasks && isExpanded })}>
              {contentTexts.map((text, index) => (
                <p key={`text-${index}`} dangerouslySetInnerHTML={{ __html: formatStepText(text) }} />
              ))}
            </div>
          )}

          {task.videos && task.videos.length > 0 && (
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

          {task.images && task.images.length > 0 && (
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

          {task.notes && task.notes.length > 0 && (
            <div className="mt-3 space-y-2">
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

          {task.cites && task.cites.length > 0 && (
            <div className="mt-4 pt-1 border-t border-muted/30">
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

          {displayContext === 'detailPage' && isExpanded && task.tasks && task.tasks.length > 0 && !isStandaloneItem && (
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
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

