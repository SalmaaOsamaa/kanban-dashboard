import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task, Column, TaskFormState } from '../types';
import { taskService } from '../services/taskService';

const COLUMN_CONFIG = [
  { id: 'todo',        title: 'TO DO',       color: '#3b82f6' },
  { id: 'in progress', title: 'IN PROGRESS', color: '#f59e0b' },
  { id: 'blocked',     title: 'BLOCKED',     color: '#ef4444' },
  { id: 'done',        title: 'DONE',        color: '#10b981' },
];

export const useTaskBoard = () => {
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState<TaskFormState>({
    title: '',
    description: '',
    dueDate: null,
    priority: 'Medium',
    column: 'todo',
  });

  // Queries    
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAll,
  });

  // mutations
  const createMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskFormState> }) =>
      taskService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });


  const columns: Column[] = COLUMN_CONFIG.map(col => ({
    ...col,
    tasks: tasks.filter(t => t.column === col.id),
  }));

  const totalTasks = tasks.length;

  //Dialog handlers
  const handleOpenAdd = (columnId: string) => {
    setActiveColumnId(columnId);
    setEditingTask(null);
    setTaskForm({ title: '', description: '', dueDate: null, priority: 'Medium', column: columnId });
    setDialogOpen(true);
  };

  const handleOpenEdit = (columnId: string, task: Task) => {
    setActiveColumnId(columnId);
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      column: task.column ?? columnId,
    });
    setDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    deleteMutation.mutate(taskId);
  };

  const handleSaveTask = () => {
    if (!taskForm.title.trim()) return;

    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: taskForm });
    } else {
      createMutation.mutate({ ...taskForm, column: activeColumnId } as Omit<Task, 'id'>);
    }

    setDialogOpen(false);
  };

  const handleMoveTask = (taskId: string, newColumn: string) => {
    updateMutation.mutate({ id: taskId, data: { column: newColumn } });
  }; 
  return {
    columns,
    totalTasks,
    isLoading,
    isError,
    dialogOpen,
    editingTask,
    taskForm,
    setTaskForm,
    handleOpenAdd,
    handleOpenEdit,
    handleDelete,
    handleSaveTask,
    handleMoveTask,
    closeDialog: () => setDialogOpen(false),
  };
};