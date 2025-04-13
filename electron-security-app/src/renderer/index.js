import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

const clerkPubKey = window.electronAPI.env.CLERK_PUBLISHABLE_KEY;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B4F6C', // Security blue
      light: '#1B6F8F',
      dark: '#083D54',
    },
    secondary: {
      main: '#00B4D8', // Cyber blue
      light: '#48CAE4',
      dark: '#0096C7',
    },
    success: {
      main: '#06D6A0', // Safe green
    },
    error: {
      main: '#EF476F', // Alert red
    },
    warning: {
      main: '#FFC43D', // Warning yellow
    },
    background: {
      default: '#FAFBFF',
      paper: '#FFFFFF',
      dark: '#0B4F6C',
    },
    shield: {
      blue: '#48CAE4',
      green: '#06D6A0',
      red: '#EF476F',
      yellow: '#FFC43D',
    }
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { 
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0B4F6C 0%, #1B6F8F 100%)',
          boxShadow: '0 4px 14px 0 rgba(11, 79, 108, 0.2)',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%)',
          boxShadow: '0 4px 14px 0 rgba(0, 180, 216, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        },
      },
    },
  },
});

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClerkProvider 
        publishableKey={clerkPubKey}
        navigate={(to) => window.location.hash = to}
        afterSignInUrl="#/dashboard"
      >
        <HashRouter>
          <App />
        </HashRouter>
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);