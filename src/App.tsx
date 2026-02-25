import {ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './theme';
import MainKanbanPage from './components/MainKanbanPage';
export default function App() {
  
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        < MainKanbanPage/>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
