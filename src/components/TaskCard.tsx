import { Box, Typography, Paper, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type {Task} from '../types';
import {getPriorityStyles} from '../utils/priorityStyles'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps { 
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {

  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: task.id,
  });
  
  return(
  <Paper
  ref={setNodeRef}
  elevation={0}
  sx={{
    p: 2, mb: 2, borderRadius: 2, border: '1px solid #e5e7eb',
    position: 'relative',
    opacity: isDragging ? 0 : 1, 
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : 'box-shadow 0.2s ease, transform 0.2s ease',
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: isDragging ? 'none' : '0 1px 2px 0 rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      transform: 'translateY(-1px)',
    },
    '&:hover .task-actions': { opacity: 1 },
  }}
    {...attributes}
    {...listeners}
  >
    <Box className="task-actions" sx={{ position: 'absolute', top: 8, right: 8, opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 0.5 }}>
    <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#f3f4f6' } }}
        >
        <EditIcon fontSize="small" sx={{ color: '#4b5563', fontSize: '1rem' }} />
      </IconButton>
      <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          sx={{ bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fee2e2' } }}
        >       
        <DeleteIcon fontSize="small" sx={{ color: '#ef4444', fontSize: '1rem' }} />
      </IconButton>
    </Box>
    <Typography variant="subtitle2" sx={{ mb: 1, color: '#111827', pr: 6 }}>{task.title}</Typography>
    <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', lineHeight: 1.5 }}>{task.description}</Typography>
    <Chip
      label={task.priority}
      size="small"
      sx={{
        ...getPriorityStyles(task.priority),
        borderRadius: 1,
        fontWeight: 600,
        fontSize: '0.65rem',
        height: 20,
        fontFamily: '"Roboto Mono", monospace',
      }}
    />
  </Paper>
  )
};

export default TaskCard;