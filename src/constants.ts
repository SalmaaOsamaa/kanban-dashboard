import type { ColumnConfig } from './types';

export const COLUMN_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'in progress',
  IN_REVIEW: 'in review',
  DONE: 'done',
} as const;

export const COLUMN_CONFIG: ColumnConfig[] = [
  { id: COLUMN_IDS.TODO,        title: 'TO DO',       color: '#3b82f6' },
  { id: COLUMN_IDS.IN_PROGRESS, title: 'IN PROGRESS', color: '#f59e0b' },
  { id: COLUMN_IDS.IN_REVIEW,   title: 'IN REVIEW',   color: '#6366f1' },
  { id: COLUMN_IDS.DONE,        title: 'DONE',        color: '#10b981' },
];
