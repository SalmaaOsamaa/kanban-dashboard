import { Box } from '@mui/material';
import { useTaskBoard } from '../hooks/useTaskBoard';
import Header from './Header';
import Board from './Board';
import TaskDialog from './TaskDialogue'

const MainKanbanPage = () => {
    const {
      columnConfig, totalTasks, debouncedSearch,
      searchQuery, setSearchQuery,
      dialogOpen, editingTask, taskForm, setTaskForm,
      handleOpenAdd, handleOpenEdit, handleDelete,
      handleSaveTask, closeDialog, handleMoveTask
    } = useTaskBoard();

    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
        <Header totalTasks={totalTasks} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <Board
          columnConfig={columnConfig}
          searchQuery={debouncedSearch}
          onAddTask={handleOpenAdd}
          onEditTask={handleOpenEdit}
          onDeleteTask={handleDelete}
          onMoveTask={handleMoveTask}
        />
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
