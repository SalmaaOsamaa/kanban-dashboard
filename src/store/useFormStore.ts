import { create } from 'zustand';
import type { Task, TaskFormState } from '../types';
import { COLUMN_IDS } from '../constants';

const DEFAULT_FORM: TaskFormState = {
  title: '',
  description: '',
  dueDate: null,
  priority: 'MEDIUM',
  column: COLUMN_IDS.TODO,
};

interface FormState {
  taskForm: TaskFormState;
  setTaskForm: (form: TaskFormState) => void;
  resetForm: (columnId?: string) => void;
  populateForm: (task: Task, columnId: string) => void;
}

export const useFormStore = create<FormState>((set) => ({
  taskForm: DEFAULT_FORM,

  setTaskForm: (form) => set({ taskForm: form }),

  resetForm: (columnId = COLUMN_IDS.TODO) =>
    set({ taskForm: { ...DEFAULT_FORM, column: columnId } }),

  populateForm: (task, columnId) =>
    set({
      taskForm: {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        column: task.column ?? columnId,
      },
    }),
}));
