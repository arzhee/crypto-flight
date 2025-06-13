
'use client';

import type { ChecklistItem as ChecklistItemType } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NextImage from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ChevronDown, ChevronRight, Square, CheckSquare as CheckSquareIcon } from 'lucide-react'; // Added CheckSquareIcon
import { useState } from 'react';
import { cn } from '@/lib/utils';

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
  taskCompletionStates: Record<string, boolean>; // Needed for recursive calls to pass down
  level: number;
  displayContext: 'mainPage' | 'detailPage';
  onNavigate?: (slug: string) => void;
  isStandaloneItem?: boolean; // True if this item is the main subject of a detail page with no sub-tasks of its own
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
  // Expand direct children on detail page by default, unless it's a standalone item (which means it's the primary content).
  const [isExpanded, setIsExpanded] = useState(level === 0 && displayContext === 'detailPage' && !isStandaloneItem);

  const ActualIcon = task.icon;

  const taskTitle = task.name || (task.texts && task.texts.length > 0 ? task.texts[0] : 'Unnamed Task');
  
  // Content texts are EITHER all texts (if task.name was the source of title)
  // OR texts AFTER the first one (if texts[0] was the source of title and task.name was null)
  // OR empty if no texts or texts[0] was title and no other texts exist.
  const contentTexts = task.name || !(task.texts && task.texts.length > 0 && task.texts[0] === taskTitle)
    ? task.texts || []
    : (task.texts && task.texts.length > 1 ? task.texts.slice(1) : []);


  // For main page, description is texts[0] if it's different from the task name.
  // If task.name is null, texts[0] becomes the title, so no separate description from texts[0].
  const mainPageDescription = displayContext === 'mainPage' && task.name && task.texts && task.texts.length > 0 
    ? task.texts[0] 
    : null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Prevent action if click is on checkbox, label, image, link, or expander button
    if (target.closest('[role="checkbox"]') || target.closest('label[for^="task-checkbox-"]') ||
        target.closest('[data-image-zoomable="true"]') || target.closest('a') ||
        target.closest('button.expander-button')) {
      return;
    }

    if (displayContext === 'mainPage' && task.slug && onNavigate) {
      onNavigate(task.slug);
    } else if (displayContext === 'detailPage') {
      // Only toggle if it's a checkable item (leaf or standalone)
      const isLeafNode = !task.tasks || task.tasks.length === 0;
      if (isLeafNode || isStandaloneItem) {
        onToggleCompletion(task.id, !isCompleted);
      } else if (task.tasks && task.tasks.length > 0) {
        // If it's a parent node on detail page, toggle expansion
        setIsExpanded(!isExpanded);
      }
    }
  };
  
  const hasSubTasks = task.tasks && task.tasks.length > 0;
  const hasOwnContent = 
    (contentTexts && contentTexts.length > 0) ||
    (task.videos && task.videos.length > 0) ||
    (task.images && task.images.length > 0) ||
    (task.notes && task.notes.length > 0) ||
    (task.cites && task.cites.length > 0);

  const cardClassName = cn(
    "mb-4 shadow-lg transition-all duration-300 ease-in-out",
    displayContext === 'mainPage' && isCompleted ? 'opacity-70 ring-2 ring-success' : displayContext === 'mainPage' ? 'hover:shadow-xl hover:scale-[1.01]' : '',
    (displayContext === 'mainPage' && task.slug) || displayContext === 'detailPage' ? 'cursor-pointer' : '',
    displayContext === 'detailPage' ? 
      (level > 0 || isStandaloneItem ? 'bg-card dark:bg-card p-3 rounded-lg shadow-sm hover:shadow-md' : 'bg-card') : 
      'bg-card',
     displayContext === 'detailPage' && level > 0 && !isStandaloneItem ? `ml-0 sm:ml-0` : '', // No margin for sub-tasks, handled by padding
     displayContext === 'detailPage' && level > 0 && !isStandaloneItem ? `pl-${level * 2} sm:pl-${level * 4}` : '' // Indentation via padding
  );
  
  // Content area is shown on detail page if expanded OR if it's a standalone item, AND there's content to show.
  const showContentArea = displayContext === 'detailPage' && (isExpanded || isStandaloneItem) && (hasOwnContent || (hasSubTasks && !isStandaloneItem));

  // Checkbox in header:
  // - Always for main page items.
  // - For detail page items only if it's a standalone item (main content of the page)
  const shouldShowCheckboxInHeader =
    displayContext === 'mainPage' || 
    (displayContext === 'detailPage' && isStandaloneItem === true);


  const DefaultIcon = isCompleted ? CheckSquareIcon : Square;

  return (
    <Card
      className={cardClassName.trim()}
      onClick={handleCardClick}
      aria-label={taskTitle}
    >
      <CardHeader className={cn(
          "flex flex-row items-center space-x-3 p-4 sm:p-6", // items-center for better vertical alignment
          displayContext === 'detailPage' ? 
            (level > 0 || isStandaloneItem ? 'pb-2 pt-2 pl-3 pr-3 sm:pb-3 sm:pt-3 sm:pl-4 sm:pr-4' : 'pb-3 pt-3') : 
            '' // Main page uses default p-4/p-6
      )}>
        {ActualIcon ? (
          <ActualIcon
            className={cn(
                `shrink-0`,
                displayContext === 'mainPage' ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-6 w-6 sm:h-7 sm:w-7', // Adjusted sub-task icon size
                isCompleted ? 'text-success' : 'text-primary'
            )}
            aria-hidden="true"
          />
        ) : ( // No ActualIcon provided by data;
          // Use disabled Checkbox for detailPage sub-tasks without icon, or default Square/CheckSquare otherwise
          (displayContext === 'detailPage' && !shouldShowCheckboxInHeader && !isStandaloneItem) ? (
             <Checkbox
              checked={isCompleted}
              aria-hidden="true"
              disabled
              className={cn(
                `shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground focus-visible:ring-primary`,
                `h-6 w-6 sm:h-7 sm:w-7` // Match icon size
              )}
            />
          ) : (
             <DefaultIcon // Fallback for main page if no icon, or other non-checkbox scenarios
              className={cn(
                  `shrink-0`,
                  displayContext === 'mainPage' ? 'h-8 w-8 sm:h-10 sm:w-10' : 'h-6 w-6 sm:h-7 sm:w-7',
                  isCompleted ? 'text-success' : 'text-primary'
              )}
              aria-hidden="true"
            />
          )
        )}
        <div className="flex-grow">
          <CardTitle 
            className={cn(
              'font-headline',
              displayContext === 'detailPage' 
                ? `!font-normal text-base sm:text-lg` // Ensure sub-task titles are normal weight
                : 'font-semibold text-lg sm:text-xl'  // Main page titles are semi-bold
            )}
            id={`task-title-${task.id}`}
          >
            {taskTitle}
          </CardTitle>
        </div>
         {hasSubTasks && displayContext === 'detailPage' && !isStandaloneItem && ( // Expander for parent tasks on detail page
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded);}} 
            className="p-1 text-muted-foreground hover:text-foreground expander-button"
            aria-expanded={isExpanded}
            aria-controls={`task-content-${task.id}`}
          >
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
        {shouldShowCheckboxInHeader && ( // Interactive checkbox
            <Checkbox
            id={`task-checkbox-${task.id}`}
            checked={isCompleted}
            onCheckedChange={(checked) => {
                onToggleCompletion(task.id, typeof checked === 'boolean' ? checked : false);
            }}
            aria-labelledby={`task-title-${task.id}`}
            className={cn(
                `shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground focus-visible:ring-primary`,
                displayContext === 'mainPage' ? 'h-6 w-6 sm:h-7 sm:w-7' : 'h-5 w-5 sm:h-6 sm:w-6' // Smaller for standalone items on detail
            )}
            />
        )}
      </CardHeader>

      {displayContext === 'mainPage' && mainPageDescription && !isCompleted && (
        <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-5 sm:pt-0">
          <CardDescription className="text-sm sm:text-base leading-relaxed">
            {mainPageDescription}
          </CardDescription>
        </CardContent>
      )}
      
      {showContentArea && (
        <CardContent 
            id={`task-content-${task.id}`}
            className={cn(
                "pt-0", // Base: no top padding unless specified by context
                // General padding for sides/bottom
                (displayContext === 'detailPage' && (level > 0 || isStandaloneItem))
                    ? "pl-10 pr-4 pb-3 sm:pl-12 sm:pr-6 sm:pb-4" // Deeper items or standalone items
                    : "p-4 sm:p-6", // Top-level items on detail page (level 0) or main page items
                // Conditional top padding based on specific scenarios
                (hasSubTasks && !isStandaloneItem && (level > 0 || isStandaloneItem))
                    ? "pt-3" // Parent sub-task that is expandable
                    : (hasOwnContent && displayContext === 'detailPage'
                        ? (level === 0 && !isStandaloneItem ? 'pt-0' : 'pt-3') // Content for level 0 items on detail page gets pt-0
                        : 'pt-0') // Default: no extra top padding from this rule
            )}
        >
          {contentTexts && contentTexts.length > 0 && (
            <div className="mt-2 space-y-1 text-sm text-foreground/90 leading-relaxed">
              {contentTexts.map((text, index) => (
                <p key={`text-${index}`} dangerouslySetInnerHTML={{ __html: formatStepText(text) }} />
              ))}
            </div>
          )}

          {task.videos && task.videos.length > 0 && (
            <div className="mt-3 space-y-3">
              {task.videos.map((videoUrl, index) => {
                const embedUrl = getYouTubeEmbedUrl(videoUrl);
                return embedUrl ? (
                  <div key={`video-${index}`} className="aspect-video w-full max-w-md mx-auto">
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
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 place-items-center sm:place-items-start">
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
            <div className="mt-4 pt-3 border-t border-muted/30">
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

          {/* Recursive rendering of sub-tasks within the detail page context */}
          {displayContext === 'detailPage' && isExpanded && task.tasks && task.tasks.length > 0 && !isStandaloneItem && (
            <div className="mt-4 space-y-3">
              {task.tasks.map((subTask) => (
                <RecursiveChecklistItem
                  key={subTask.id}
                  task={subTask}
                  isCompleted={!!taskCompletionStates[subTask.id]} // Get completion from the central state
                  onToggleCompletion={onToggleCompletion}
                  onImageZoom={onImageZoom}
                  taskCompletionStates={taskCompletionStates} // Pass down the full state for further recursion
                  level={level + 1}
                  displayContext="detailPage"
                  // onNavigate is not needed for sub-tasks
                  // isStandaloneItem is false for sub-tasks
                />
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
