import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", sans-serif',
    h6: {
      fontFamily: '"Roboto Mono", monospace',
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    subtitle2: {
      fontFamily: '"Roboto Mono", monospace',
      fontWeight: 600,
    },
    body2: {
      color: '#4b5563',
    },
  },
  palette: {
    background: {
      default: '#ffffff',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;