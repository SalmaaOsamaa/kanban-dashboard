export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  column: string;
  order?: number;
}

export interface ColumnConfig {
  id: string;
  title: string;
  color: string;
}

export interface Column extends ColumnConfig {
  tasks: Task[];
}

export interface PaginatedResponse {
  data: Task[];
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
}

export interface TaskFormState {
  title: string;
  description: string;
  dueDate: string | null;
  priority: Priority;
  column: string;
}