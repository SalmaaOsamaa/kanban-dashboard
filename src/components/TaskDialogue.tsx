import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { useUIStore } from '../store/useUIStore';
import { useFormStore } from '../store/useFormStore';
import { useTaskMutations } from '../hooks/useTaskMutations';
import type { Priority } from '../types';

const TaskDialog = () => {
  const dialogOpen = useUIStore((s) => s.dialogOpen);
  const editingTask = useUIStore((s) => s.editingTask);
  const closeDialog = useUIStore((s) => s.closeDialog);

  const taskForm = useFormStore((s) => s.taskForm);
  const setTaskForm = useFormStore((s) => s.setTaskForm);

  const { handleSaveTask } = useTaskMutations();

  return (
    <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 600 }}>
        {editingTask ? 'Edit Task' : 'Add Task'}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          variant="outlined"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth variant="outlined">
          <InputLabel>Priority</InputLabel>
          <Select
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as Priority })}
            label="Priority"
          >
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={closeDialog} color="inherit">Cancel</Button>
        <Button onClick={handleSaveTask} variant="contained" sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
