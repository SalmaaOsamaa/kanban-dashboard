import { create } from 'zustand';
import type { Task } from '../types';
import { useFormStore } from './useFormStore';

interface UIState {
  dialogOpen: boolean;
  editingTask: Task | null;
  activeColumnId: string;
  openAddDialog: (columnId: string) => void;
  openEditDialog: (columnId: string, task: Task) => void;
  closeDialog: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  dialogOpen: false,
  editingTask: null,
  activeColumnId: '',

  openAddDialog: (columnId) => {
    useFormStore.getState().resetForm(columnId);
    set({ activeColumnId: columnId, editingTask: null, dialogOpen: true });
  },

  openEditDialog: (columnId, task) => {
    useFormStore.getState().populateForm(task, columnId);
    set({ activeColumnId: columnId, editingTask: task, dialogOpen: true });
  },

  closeDialog: () => set({ dialogOpen: false }),
}));
