import React from 'react';
import { Box, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { Shield, VerifiedUser, Security, Lock, Code, CloudDone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield sx={{ fontSize: 48, color: 'shield.blue' }} />,
      title: 'Real-time Protection',
      description: 'Advanced threat detection with AI-powered scanning'
    },
    {
      icon: <Lock sx={{ fontSize: 48, color: 'shield.green' }} />,
      title: 'Secure Analysis',
      description: 'Military-grade encryption for file scanning'
    },
    {
      icon: <Code sx={{ fontSize: 48, color: 'shield.yellow' }} />,
      title: 'Deep Scanning',
      description: 'Advanced code analysis and signature detection'
    }
  ];

  return (
    <Box sx={{ 
      background: '#FFFFFF',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        opacity: 0.05,
        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230B4F6C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <Container maxWidth="lg" sx={{ 
        position: 'relative',
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Box sx={{ 
          pt: { xs: 4, sm: 6, md: 12 }, 
          pb: { xs: 4, sm: 6, md: 8 },
          textAlign: 'center' 
        }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              mb: 2,
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Kavach.AI Security
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Advanced Malware Detection for Your Security
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/login')}
            sx={{ 
              bgcolor: '#3B82F6',
              '&:hover': { bgcolor: '#2563EB' },
              px: 4,
              py: 1.5,
            }}
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ mt: { xs: 2, sm: 3, md: 4 } }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(11, 79, 108, 0.1)',
                    borderColor: 'primary.main',
                  }
                }}
              >
                <Box sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  mx: 'auto',
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
