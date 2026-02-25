import { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Column from './Column';
import TaskCard from './TaskCard';
import type { ColumnConfig, Column as ColumnType, Task, PaginatedResponse } from '../types';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
} from '@dnd-kit/core';

interface BoardProps {
  columnConfig: ColumnConfig[];
  searchQuery: string;
  onAddTask: (colId: string) => void;
  onEditTask: (colId: string, task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newColumn: string, targetIndex: number) => void;
}

interface DropIndicatorState {
  columnId: string;
  index: number;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.4' },
    },
  }),
  duration: 250,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
};

const Board = ({ columnConfig, searchQuery, onAddTask, onEditTask, onDeleteTask, onMoveTask }: BoardProps) => {
  const queryClient = useQueryClient();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const getColumnsSnapshot = useCallback((): ColumnType[] => {
    return columnConfig.map(col => {
      const data = queryClient.getQueryData<InfiniteData<PaginatedResponse, number>>(
        ['column-tasks', col.id, searchQuery]
      );
      const tasks = (data?.pages.flatMap(p => p.data) ?? [])
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return { ...col, tasks };
    });
  }, [columnConfig, searchQuery, queryClient]);

  const handleDragStart = (event: DragStartEvent) => {
    const columns = getColumnsSnapshot();
    const task = columns.flatMap(c => c.tasks).find(t => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
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
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

    onMoveTask(taskId, targetColumn.id, targetIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto', height: 'calc(100vh - 89px)', alignItems: 'flex-start' }}>
        {columnConfig.map((col) => (
          <Column
            key={col.id}
            column={col}
            searchQuery={searchQuery}
            isOver={overColumnId === col.id}
            dropIndicatorIndex={dropIndicator?.columnId === col.id ? dropIndicator.index : null}
            activeTaskId={activeTask?.id ?? null}
            onAddTask={() => onAddTask(col.id)}
            onEditTask={(task) => onEditTask(col.id, task)}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </Box>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask && (
          <Box sx={{
            transform: 'rotate(2deg) scale(1.03)',
            transition: 'transform 0.15s ease',
            filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.15))',
          }}>
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Board;
