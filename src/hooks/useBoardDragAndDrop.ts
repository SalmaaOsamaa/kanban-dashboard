import { useState, useCallback } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { COLUMN_CONFIG } from '../constants';
import { useSearchStore } from '../store/useSearchStore';
import { useTaskMutations } from './useTaskMutations';
import type { Column, Task, PaginatedResponse } from '../types';

export interface DropIndicatorState {
  columnId: string;
  index: number;
}

export const useBoardDragAndDrop = () => {
  const queryClient = useQueryClient();
  const debouncedSearch = useSearchStore((s) => s.debouncedSearch);
  const { handleMoveTask } = useTaskMutations();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getColumnsSnapshot = useCallback((): Column[] => {
    return COLUMN_CONFIG.map(col => {
      const data = queryClient.getQueryData<InfiniteData<PaginatedResponse, number>>(
        ['column-tasks', col.id, debouncedSearch]
      );
      const tasks = (data?.pages.flatMap((p: { data: Task[] }) => p.data) ?? [])
        .sort((a: Task, b: Task) => (a.order ?? 0) - (b.order ?? 0));
      return { ...col, tasks };
    });
  }, [debouncedSearch, queryClient]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const columns = getColumnsSnapshot();
    const task = columns.flatMap(c => c.tasks).find(t => t.id === event.active.id);
    setActiveTask(task ?? null);
  }, [getColumnsSnapshot]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      setDropIndicator(null);
      return;
    }

    const columns = getColumnsSnapshot();
    const overId = over.id as string;
    const targetColumn = columns.find(col =>
      col.id === overId || col.tasks.some(t => t.id === overId)
    );

    if (!targetColumn) {
      setOverColumnId(null);
      setDropIndicator(null);
      return;
    }

    setOverColumnId(targetColumn.id);

    const isOverColumn = targetColumn.id === overId;
    if (isOverColumn) {
      setDropIndicator({ columnId: targetColumn.id, index: targetColumn.tasks.length });
    } else {
      const taskIndex = targetColumn.tasks.findIndex(t => t.id === overId);
      setDropIndicator({ columnId: targetColumn.id, index: taskIndex });
    }
  }, [getColumnsSnapshot]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    const currentDropIndicator = dropIndicator;
    setActiveTask(null);
    setOverColumnId(null);
    setDropIndicator(null);
    if (!over) return;

    const columns = getColumnsSnapshot();
    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find(col =>
      col.id === overId || col.tasks.some(t => t.id === overId)
    );
    if (!targetColumn) return;

    const sourceColumn = columns.find(col => col.tasks.some(t => t.id === taskId));
    if (!sourceColumn || sourceColumn.id === targetColumn.id) return;

    const targetIndex = currentDropIndicator?.columnId === targetColumn.id
      ? currentDropIndicator.index
      : targetColumn.tasks.length;

    handleMoveTask(taskId, targetColumn.id, targetIndex);
  }, [dropIndicator, getColumnsSnapshot, handleMoveTask]);

  return {
    sensors,
    activeTask,
    overColumnId,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
