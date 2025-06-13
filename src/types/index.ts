import type { LucideIcon } from 'lucide-react';

export interface ChecklistItem {
  id: string;
  slug: string | null; // Can be null for sub-tasks not meant to be directly navigable
  name: string | null; // Name can be null if the first text line acts as the name
  icon: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>> | null;
  texts: string[];
  videos?: string[];
  images?: string[];
  notes?: string[];
  cites?: string[];
  completed?: boolean; // From static data, used for initial seeding
  tasks?: ChecklistItem[]; // For recursive sub-tasks
}