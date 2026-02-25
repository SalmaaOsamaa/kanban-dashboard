import { Box } from '@mui/material';
import Column from './Column';
import TaskCard from './TaskCard';
import { COLUMN_CONFIG } from '../constants';
import { useBoardDragAndDrop } from '../hooks/useBoardDragAndDrop';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from '@dnd-kit/core';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: { opacity: '0.4' },
    },
  }),
  duration: 250,
  easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
};

const Board = () => {
  const {
    sensors,
    activeTask,
    overColumnId,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useBoardDragAndDrop();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ display: 'flex', gap: 3, p: 3, overflowX: 'auto', height: 'calc(100vh - 89px)', alignItems: 'flex-start' }}>
        {COLUMN_CONFIG.map((col) => (
          <Column
            key={col.id}
            column={col}
            isOver={overColumnId === col.id}
            dropIndicatorIndex={dropIndicator?.columnId === col.id ? dropIndicator.index : null}
            activeTaskId={activeTask?.id ?? null}
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
