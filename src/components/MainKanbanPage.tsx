import { Box, CircularProgress, Typography } from '@mui/material';
import { useTaskBoard } from '../hooks/useTaskBoard';
import Header from './Header';
import Board from './Board';
import TaskDialog from './TaskDialogue'

const MainKanbanPage = () => {
    const {
      columns, totalTasks, isLoading, isError,
      searchQuery, setSearchQuery,
      dialogOpen, editingTask, taskForm, setTaskForm,
      handleOpenAdd, handleOpenEdit, handleDelete,
      handleSaveTask, closeDialog, handleMoveTask
    } = useTaskBoard();
  
    if (isLoading) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  
    if (isError) return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Failed to load tasks. Is json-server running?</Typography>
      </Box>
    );
  
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
        <Header totalTasks={totalTasks} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <Board columns={columns} onAddTask={handleOpenAdd} onEditTask={handleOpenEdit} onDeleteTask={handleDelete}   onMoveTask={handleMoveTask} />
        <TaskDialog
          open={dialogOpen}
          isEditing={!!editingTask}
          form={taskForm}
          onChange={setTaskForm}
          onSave={handleSaveTask}
          onClose={closeDialog}
        />
      </Box>
    );
  }

  export default MainKanbanPage;