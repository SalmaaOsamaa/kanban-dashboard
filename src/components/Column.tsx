import { Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskCard from './TaskCard';
import type { Column as ColumnType, Task } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface ColumnProps {
  column: ColumnType;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  isOver : boolean
}

const Column = ({ column, isOver, onAddTask, onEditTask, onDeleteTask }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <Box
    sx={{
      width: 320, minWidth: 320, borderRadius: 3, p: 2,
      display: 'flex', flexDirection: 'column',
      bgcolor: isOver ? '#ede9fe' : '#f3f4f6',
      outline: isOver ? `2px solid ${column.color}` : '2px solid transparent',
      transition: 'background-color 0.2s ease, outline 0.2s ease',
    }}
  >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: column.color, mr: 1.5 }} />
        <Typography variant="subtitle2" sx={{ color: '#4b5563', letterSpacing: '0.05em' }}>{column.title}</Typography>
        <Box sx={{ ml: 1.5, bgcolor: '#e5e7eb', color: '#4b5563', px: 1, py: 0.25, borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
          {column.tasks.length}
        </Box>
      </Box>
      <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>

        <Box
          ref={setNodeRef}
          sx={{
            flexGrow: 1, overflowY: 'auto', minHeight: 60,
            borderRadius: 2, transition: 'background 0.2s',
            bgcolor: isOver ? '#e0e7ff' : 'transparent',
            p: isOver ? 1 : 0,
          }}
        >
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
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
  )
};

export default Column;