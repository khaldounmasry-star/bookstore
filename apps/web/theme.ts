'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    background: {
      default: '#FCFCFC',
      paper: '#FFFFFF'
    },
    primary: {
      main: '#2563EB',
      light: '#3B82F6',
      dark: '#1D4ED8',
      contrastText: '#FFFFFF'
    },
    secondary: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#4B5563',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF'
    },
    divider: '#E5E7EB'
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.875rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5, color: '#4B5563' }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#F5F4F4',
          color: '#111827',
          boxShadow: 'inset 0 -1px 0 0 #E5E7EB'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: 'none'
        }
      }
    }
  }
});

export default theme;
