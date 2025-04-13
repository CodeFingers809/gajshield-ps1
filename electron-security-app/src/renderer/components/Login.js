import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Container, Paper, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { createOrGetUser } from '../../lib/supabase';

function Login() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function handleUserAuth() {
      if (isSignedIn && user) {
        setLoading(true);
        try {
          await createOrGetUser(user);
          navigate('/dashboard');
        } catch (err) {
          console.error('Authentication error:', err);
          setError('Failed to authenticate. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    }

    handleUserAuth();
  }, [isSignedIn, user, navigate]);

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 12,
      px: 2,
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Welcome to Kavach.AI
          </Typography>
          <Typography color="text.secondary">
            Sign in to protect your system with advanced malware detection
          </Typography>
        </Box>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <SignIn 
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                  boxShadow: 'none'
                },
                card: {
                  border: 'none',
                  boxShadow: 'none',
                  width: '100%'
                }
              }
            }}
            routing="hash"
            afterSignInUrl="#/dashboard"
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
