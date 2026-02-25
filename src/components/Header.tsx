import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { taskService } from '../services/taskService';
import { useSearchStore } from '../store/useSearchStore';

const Header = () => {
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);

  const { data: totalTasks = 0 } = useQuery({
    queryKey: ['tasks-count'],
    queryFn: taskService.getCount,
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderBottom: '1px solid #e5e7eb' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: '#4f46e5', color: 'white', p: 1, borderRadius: 2, display: 'flex' }}>
          <DashboardIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1.25rem', lineHeight: 1.2 }}>KANBAN BOARD</Typography>
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{totalTasks} tasks</Typography>
        </Box>
      </Box>
      <TextField
        placeholder="Search tasks..."
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: 300,
          '& .MuiOutlinedInput-root': {
            bgcolor: '#f3f4f6',
            borderRadius: 2,
            '& fieldset': { border: 'none' },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#9ca3af' }} />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default Header;
