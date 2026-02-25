import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import type { TaskFormState } from '../types';

interface TaskDialogProps {
  open: boolean;
  isEditing: boolean;
  form: TaskFormState;
  onChange: (form: TaskFormState) => void;
  onSave: () => void;
  onClose: () => void;
}

const TaskDialog = ({ open, isEditing, form, onChange, onSave, onClose }: TaskDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 600 }}>
      {isEditing ? 'Edit Task' : 'Add Task'}
    </DialogTitle>
    <DialogContent dividers>
      <TextField
        autoFocus
        margin="dense"
        label="Title"
        fullWidth
        variant="outlined"
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        margin="dense"
        label="Description"
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        value={form.description}
        onChange={(e) => onChange({ ...form, description: e.target.value })}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined">
        <InputLabel>Priority</InputLabel>
        <Select
          value={form.priority}
          onChange={(e) => onChange({ ...form, priority: e.target.value })}
          label="Priority"
        >
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} color="inherit">Cancel</Button>
      <Button onClick={onSave} variant="contained" sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

export default TaskDialog;