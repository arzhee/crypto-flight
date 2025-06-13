
'use client';

import type { ChecklistItem as ChecklistItemType } from '@/types';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NextImage from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Square, CheckSquare as CheckSquareIcon,ChevronDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

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
}: RecursiveChecklistItemProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Sub-tasks are expanded by default

  const IconComponent = task.icon;
  const DefaultIcon = isCompleted ? CheckSquareIcon : Square;

  const taskTitle = task.name || (task.texts && task.texts.length > 0 ? task.texts[0] : 'Unnamed Task');
  const contentTexts = task.name ? task.texts : (task.texts && task.texts.length > 1 ? task.texts.slice(1) : []);
  const mainPageDescription = displayContext === 'mainPage' && task.texts && task.texts.length > 0 ? task.texts[0] : null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('[role="checkbox"]') || target.closest('label[for^="task-checkbox-"]')) {
      return;
    }
    if (displayContext === 'mainPage' && task.slug && onNavigate) {
      onNavigate(task.slug);
    } else if (displayContext === 'detailPage') {
      // Allow toggling completion by clicking the card area for detail page items
       if (target.closest('[data-image-zoomable="true"]')) {
        return;
      }
      onToggleCompletion(task.id, !isCompleted);
    }
  };
  
  const hasSubTasks = task.tasks && task.tasks.length > 0;
  const hasOwnContent = (contentTexts && contentTexts.length > 0) ||
                        (task.videos && task.videos.length > 0) ||
                        (task.images && task.images.length > 0) ||
                        (task.notes && task.notes.length > 0) ||
                        (task.cites && task.cites.length > 0);


  const cardClassName = `
    mb-4 shadow-lg transition-all duration-300 ease-in-out
    ${isCompleted && displayContext === 'mainPage' ? 'opacity-70 ring-2 ring-success' : displayContext === 'mainPage' ? 'hover:shadow-xl hover:scale-[1.01]' : ''}
    ${(displayContext === 'mainPage' && task.slug) || displayContext === 'detailPage' ? 'cursor-pointer' : ''}
    ${displayContext === 'detailPage' ? `ml-${level * 4} bg-muted/30 dark:bg-muted/20 p-3 rounded-lg shadow-sm hover:shadow-md` : ''}
  `;

  return (
    <Card
      className={cardClassName.trim()}
      onClick={handleCardClick}
      aria-label={taskTitle}
    >
      <CardHeader className={`flex flex-row items-center space-x-3 p-4 sm:p-6 ${displayContext === 'detailPage' ? 'pb-3 pt-3' : ''}`}>
        {IconComponent ? (
          <IconComponent
            className={`h-8 w-8 sm:h-10 ${isCompleted ? 'text-success' : 'text-primary'} shrink-0 ${displayContext === 'detailPage' ? 'h-6 w-6 sm:h-7 sm:w-7' : ''}`}
            aria-hidden="true"
          />
        ) : displayContext === 'detailPage' ? ( // Default icon for sub-tasks on detail page if task.icon is null
          <DefaultIcon
            className={`h-6 w-6 sm:h-7 sm:w-7 ${isCompleted ? 'text-success' : 'text-primary'} shrink-0`}
            aria-hidden="true"
          />
        ): (
             <div className={`h-8 w-8 sm:h-10 bg-muted/20 rounded shrink-0 ${displayContext === 'detailPage' ? 'h-6 w-6 sm:h-7 sm:w-7' : ''}`} />
        )}
        <div className="flex-grow">
          <CardTitle className={`font-headline text-lg sm:text-xl ${displayContext === 'detailPage' ? 'text-base sm:text-lg' : ''}`} id={`task-title-${task.id}`}>
            {taskTitle}
          </CardTitle>
        </div>
         {hasSubTasks && displayContext === 'detailPage' && (
          <button onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded);}} className="p-1">
            {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        )}
        <Checkbox
          id={`task-checkbox-${task.id}`}
          checked={isCompleted}
          onCheckedChange={(checked) => onToggleCompletion(task.id, typeof checked === 'boolean' ? checked : false)}
          aria-labelledby={`task-title-${task.id}`}
          className={`h-6 w-6 sm:h-7 sm:w-7 shrink-0 border-2 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground ${displayContext === 'detailPage' ? 'h-5 w-5 sm:h-6 sm:w-6' : ''}`}
        />
      </CardHeader>

      {displayContext === 'mainPage' && mainPageDescription && !isCompleted && (
        <CardContent className="px-4 pb-4 pt-0 sm:px-6 sm:pb-5 sm:pt-0">
          <CardDescription className="text-sm sm:text-base leading-relaxed">
            {mainPageDescription}
          </CardDescription>
        </CardContent>
      )}
      
      {displayContext === 'detailPage' && isExpanded && (hasOwnContent || hasSubTasks) && (
        <CardContent className="pl-10 pr-4 pb-3 pt-0 sm:pl-12 sm:pr-6 sm:pb-4">
          {contentTexts && contentTexts.length > 0 && (
            <div className="mt-2 space-y-1 text-sm text-foreground leading-relaxed">
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

          {task.tasks && task.tasks.length > 0 && (
            <div className="mt-4 space-y-4">
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
