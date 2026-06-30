import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#6366F1', // Indigo
            light: '#818CF8',
            dark: '#4F46E5',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#06B6D4', // Cyan
            light: '#22D3EE',
            dark: '#0891B2',
            contrastText: '#ffffff',
          },
          background: {
            default: '#F8FAFC',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#0F172A',
            secondary: '#475569',
          },
          divider: '#E2E8F0',
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#818CF8', // Bright Indigo
            light: '#A5B4FC',
            dark: '#6366F1',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#22D3EE', // Cyan
            light: '#67E8F9',
            dark: '#06B6D4',
            contrastText: '#0F172A',
          },
          background: {
            default: '#0F172A',
            paper: '#1E293B',
          },
          text: {
            primary: '#F8FAFC',
            secondary: '#CBD5E1',
          },
          divider: '#334155',
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light' 
            ? '0px 4px 20px rgba(0, 0, 0, 0.05)' 
            : '0px 4px 20px rgba(0, 0, 0, 0.2)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export const getTheme = (mode) => createTheme(getDesignTokens(mode));
