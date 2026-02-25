import { Box } from '@mui/material';
import Header from './Header';
import Board from './Board';
import TaskDialog from './TaskDialogue';

const MainKanbanPage = () => (
  <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
    <Header />
    <Board />
    <TaskDialog />
  </Box>
);

export default MainKanbanPage;
