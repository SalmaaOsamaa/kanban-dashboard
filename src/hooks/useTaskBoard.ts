import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { Task, ColumnConfig, TaskFormState, PaginatedResponse } from '../types';
import { taskService, type TaskUpdate } from '../services/taskService';
import { useDebouncedValue } from './useDebouncedValue';

export const COLUMN_CONFIG: ColumnConfig[] = [
  { id: 'todo',        title: 'TO DO',       color: '#3b82f6' },
  { id: 'in progress', title: 'IN PROGRESS', color: '#f59e0b' },
  { id: 'in review',   title: 'IN REVIEW',   color: '#6366f1' },
  { id: 'done',        title: 'DONE',        color: '#10b981' },
];

export const useTaskBoard = () => {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery);

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

  const { data: totalTasks = 0 } = useQuery({
    queryKey: ['tasks-count'],
    queryFn: taskService.getCount,
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['column-tasks'] });
    queryClient.invalidateQueries({ queryKey: ['tasks-count'] });
  };

  const createMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: invalidateAll,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      taskService.update(id, data),
    onSuccess: invalidateAll,
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: invalidateAll,
  });

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

  const handleMoveTask = (taskId: string, newColumn: string, targetIndex: number) => {
    const data = queryClient.getQueryData<InfiniteData<PaginatedResponse, number>>(
      ['column-tasks', newColumn, debouncedSearch]
    );
    const targetColumnTasks = (data?.pages.flatMap(p => p.data) ?? [])
      .filter(t => t.id !== taskId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    let newOrder: number;
    if (targetColumnTasks.length === 0) {
      newOrder = 1000;
    } else if (targetIndex === 0) {
      newOrder = (targetColumnTasks[0].order ?? 1000) - 1000;
    } else if (targetIndex >= targetColumnTasks.length) {
      newOrder = (targetColumnTasks[targetColumnTasks.length - 1].order ?? 0) + 1000;
    } else {
      const prevOrder = targetColumnTasks[targetIndex - 1].order ?? 0;
      const nextOrder = targetColumnTasks[targetIndex].order ?? prevOrder + 2000;
      newOrder = (prevOrder + nextOrder) / 2;
    }

    updateMutation.mutate({ id: taskId, data: { column: newColumn, order: newOrder } });
  };

  return {
    columnConfig: COLUMN_CONFIG,
    totalTasks,
    debouncedSearch,
    searchQuery,
    setSearchQuery,
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
