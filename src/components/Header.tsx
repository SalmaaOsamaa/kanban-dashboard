import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';

interface HeaderProps {
  totalTasks: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ totalTasks, searchQuery, onSearchChange }: HeaderProps) => (
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
      onChange={(e) => onSearchChange(e.target.value)}
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

export default Header;