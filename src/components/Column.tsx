import { useRef, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';
import type { ColumnConfig, Task } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useColumnTasks } from '../hooks/useColumnTasks';

interface ColumnProps {
  column: ColumnConfig;
  searchQuery: string;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isOver: boolean;
  dropIndicatorIndex: number | null;
  activeTaskId: string | null;
}

const DropIndicator = ({ color }: { color: string }) => (
  <Box
    sx={{
      height: 4,
      borderRadius: 2,
      bgcolor: color,
      mb: 2,
      mx: 0.5,
      boxShadow: `0 0 8px ${color}`,
      animation: 'pulse 1s ease-in-out infinite',
      '@keyframes pulse': {
        '0%, 100%': { opacity: 0.7, transform: 'scaleX(0.98)' },
        '50%': { opacity: 1, transform: 'scaleX(1)' },
      },
    }}
  />
);

const Column = ({ column, searchQuery, isOver, dropIndicatorIndex, activeTaskId, onAddTask, onEditTask, onDeleteTask }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const { tasks, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useColumnTasks(column.id, searchQuery);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node);
    scrollContainerRef.current = node;
  }, [setNodeRef]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const scrollContainer = scrollContainerRef.current;
    if (!sentinel || !scrollContainer || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: scrollContainer, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderTasksWithIndicator = () => {
    const elements: React.ReactNode[] = [];
    const visibleTasks = tasks.filter(t => t.id !== activeTaskId);

    visibleTasks.forEach((task, index) => {
      if (dropIndicatorIndex === index) {
        elements.push(<DropIndicator key="drop-indicator" color={column.color} />);
      }
      elements.push(
        <TaskCard
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
        />
      );
    });

    if (dropIndicatorIndex !== null && dropIndicatorIndex >= visibleTasks.length) {
      elements.push(<DropIndicator key="drop-indicator" color={column.color} />);
    }

    return elements;
  };

  return (
    <Box
      sx={{
        width: 320, minWidth: 320, maxHeight: '100%', borderRadius: 3, p: 2,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        bgcolor: isOver ? '#ede9fe' : '#f3f4f6',
        outline: isOver ? `2px solid ${column.color}` : '2px solid transparent',
        transition: 'background-color 0.2s ease, outline 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: column.color, mr: 1.5 }} />
        <Typography variant="subtitle2" sx={{ color: '#4b5563', letterSpacing: '0.05em' }}>{column.title}</Typography>
        <Box sx={{ ml: 1.5, bgcolor: '#e5e7eb', color: '#4b5563', px: 1, py: 0.25, borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
          {tasks.length}
        </Box>
      </Box>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <Box
          ref={combinedRef}
          sx={{
            flexGrow: 1, overflowY: 'auto', minHeight: 60,
            borderRadius: 2, transition: 'background 0.2s, padding 0.2s',
            bgcolor: isOver ? 'rgba(224, 231, 255, 0.5)' : 'transparent',
            p: isOver ? 1 : 0,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#d1d5db',
              borderRadius: 3,
              '&:hover': { bgcolor: '#9ca3af' },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db transparent',
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : isError ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" color="error">Failed to load</Typography>
            </Box>
          ) : (
            <>
              {renderTasksWithIndicator()}
              <Box ref={sentinelRef} sx={{ height: 1 }} />
              {isFetchingNextPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </>
          )}
        </Box>
      </SortableContext>
      <Box
        onClick={onAddTask}
        sx={{
          mt: 1, p: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#6b7280', cursor: 'pointer', borderRadius: 2,
          border: '1px dashed #d1d5db',
          '&:hover': { bgcolor: '#e5e7eb' },
        }}
      >
        <AddIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>Add task</Typography>
      </Box>
    </Box>
  );
};

export default Column;
