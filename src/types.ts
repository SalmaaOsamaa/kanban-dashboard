export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    dueDate : string | null;
    column : string;
    order?: number;
  }
  
  export interface Column {
    id: string;
    title: string;
    color: string;
    tasks: Task[];
  }
  
  export interface TaskFormState {
    title: string;
    description: string;
    dueDate: string | null;
    priority: string;
    column: string;
  }