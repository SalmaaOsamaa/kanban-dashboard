import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { taskService, type TaskUpdate } from '../services/taskService';
import type { Task, PaginatedResponse } from '../types';
import { useFormStore } from '../store/useFormStore';
import { useUIStore } from '../store/useUIStore';
import { useSearchStore } from '../store/useSearchStore';

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

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

  const handleSaveTask = () => {
    const { taskForm } = useFormStore.getState();
    const { editingTask, activeColumnId, closeDialog } = useUIStore.getState();

    if (!taskForm.title.trim()) return;

    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: taskForm });
    } else {
      createMutation.mutate({ ...taskForm, column: activeColumnId } as Omit<Task, 'id'>);
    }

    closeDialog();
  };

  const handleMoveTask = (taskId: string, newColumn: string, targetIndex: number) => {
    const { debouncedSearch } = useSearchStore.getState();
    const data = queryClient.getQueryData<InfiniteData<PaginatedResponse, number>>(
      ['column-tasks', newColumn, debouncedSearch],
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

  const handleDelete = (taskId: string) => {
    deleteMutation.mutate(taskId);
  };

  return { handleSaveTask, handleMoveTask, handleDelete };
};
