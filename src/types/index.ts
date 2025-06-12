
import type { LucideIcon } from 'lucide-react';

export interface TaskStep {
  id: string; // e.g., "1-step-1"
  texts: string[]; // Array of text lines for the step. First line is primary.
  notes?: string[]; // Notes specific to non-FAQ steps.
  videos?: string[]; // Array of video URLs
  images?: string[]; // Array of image URLs
  cites?: string[]; // Optional array of citation strings
  completed: boolean; // Completion status for this specific step
}

export interface ChecklistItem {
  id: string; // e.g., "1", "2"
  slug: string; // e.g., "learn-about-crypto"
  name: string; // The main title of the task (formerly title)
  Icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; // Lucide icon component
  text: string; // The main description text for the task (formerly description)
  steps: TaskStep[]; // Array of detailed steps for the task
}
