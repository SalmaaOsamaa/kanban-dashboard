import { useState } from 'react';
import { Box } from '@mui/material';
import Column from './Column';
import TaskCard from './TaskCard';
import type { Column as ColumnType, Task } from '../types';
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
  columns: ColumnType[];
  onAddTask: (colId: string) => void;
  onEditTask: (colId: string, task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newColumn: string, targetIndex: number) => void;
}

interface DropIndicator {
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

const Board = ({ columns, onAddTask, onEditTask, onDeleteTask, onMoveTask }: BoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
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
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            isOver={overColumnId === column.id}
            dropIndicatorIndex={dropIndicator?.columnId === column.id ? dropIndicator.index : null}
            activeTaskId={activeTask?.id ?? null}
            onAddTask={() => onAddTask(column.id)}
            onEditTask={(task) => onEditTask(column.id, task)}
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