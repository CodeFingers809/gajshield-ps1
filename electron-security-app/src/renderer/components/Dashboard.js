import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Stack, Tooltip, Badge, useMediaQuery, useTheme, CircularProgress, Breadcrumbs, Link, ButtonGroup, Button } from '@mui/material';
import { Security, Assessment, Settings, Logout, AccountCircle, Shield, CloudDone, NotificationsNone, CreditCard, Menu as MenuIcon, Close as CloseIcon, Chat, SecurityUpdate, NavigateNext } from '@mui/icons-material';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { supabase, fetchScanHistory, fetchUserData } from '../../lib/supabase';

const drawerWidth = 240;

function Dashboard() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [scanHistory, setScanHistory] = React.useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      fetchScanHistory(user.id)
        .then(setScanHistory)
        .catch(console.error);
    }
  }, [user]);

  React.useEffect(() => {
    async function loadUserData() {
      if (user) {
        try {
          const data = await fetchUserData(user.id);
          setUserData(data);
        } catch (error) {
          console.error('Error loading user data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadUserData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleSignOut = () => {
    signOut().then(() => {
      navigate('/');
    });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Scan Files', icon: <Security />, path: '/dashboard/scan' },
    { text: 'Log Analysis', icon: <SecurityUpdate />, path: '/dashboard/logs' },
    { text: 'Scan History', icon: <Assessment />, path: '/dashboard/history' },
    { text: 'AI Assistant', icon: <Chat />, path: '/dashboard/chat' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' }
  ];

  const getBreadcrumbText = (path) => {
    const segments = path.split('/').filter(Boolean);
    return segments[segments.length - 1]?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Dashboard';
  };

  const drawer = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      p: 3 
    }}>
      <List sx={{ p: 0, flexGrow: 0.9 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              py: 1.5,
              backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'secondary.light' : 'white',
              minWidth: 40 
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: location.pathname === item.path ? 600 : 500,
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <ListItem 
          button 
          onClick={handleSignOut}
          sx={{
            borderRadius: 2,
            py: 1.5,
            bgcolor: 'rgba(239, 71, 111, 0.1)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(239, 71, 111, 0.2)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          <ListItemIcon sx={{ 
            color: '#EF476F',
            minWidth: 40,
            transition: 'transform 0.2s ease',
            '.MuiListItem-root:hover &': {
              transform: 'rotate(360deg)'
            }
          }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Sign Out"
            primaryTypographyProps={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#EF476F'
            }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ 
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        WebkitAppRegion: 'drag', // Makes the AppBar draggable
      }}>
        <Toolbar sx={{ 
          minHeight: { xs: '56px', md: '64px' }, 
          px: { xs: 2, sm: 3, md: 4 },
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          {/* Left section */}
          <Stack direction="row" spacing={3} alignItems="center">
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
            <Stack direction="row" spacing={1} alignItems="center">
              <Shield sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #0B4F6C 0%, #00B4D8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Kavach.AI
              </Typography>
            </Stack>

            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" />}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' }
              }}
            >
              <Link 
                color="inherit" 
                href="#/dashboard"
                underline="hover"
                sx={{ color: 'text.secondary' }}
              >
                Dashboard
              </Link>
              <Typography color="primary.main" fontWeight={500}>
                {getBreadcrumbText(location.pathname)}
              </Typography>
            </Breadcrumbs>
          </Stack>

          {/* Right section */}
          <Stack direction="row" spacing={2} alignItems="center">
            <ButtonGroup variant="outlined" size="small">
              <Tooltip title="Quick Scan">
                <Button
                  startIcon={<Security />}
                  onClick={() => navigate('/dashboard/scan')}
                  color="primary"
                >
                  Quick Scan
                </Button>
              </Tooltip>
            </ButtonGroup>

            <Tooltip title="Notifications">
              <IconButton size="small" sx={{ 
                bgcolor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                '&:hover': { bgcolor: 'background.paper' }
              }}>
                <Badge color="error" variant="dot">
                  <NotificationsNone fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title={userData?.full_name || user?.fullName}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 2,
                '&:hover': { bgcolor: 'background.paper' }
              }}>
                <Avatar 
                  src={userData?.avatar_url || user?.imageUrl} 
                  alt={userData?.full_name || user?.fullName}
                  sx={{ 
                    width: 36, 
                    height: 36,
                    border: '2px solid',
                    borderColor: 'primary.light',
                  }}
                />
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {userData?.full_name || user?.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userData?.email || user?.emailAddresses[0]?.emailAddress}
                  </Typography>
                </Box>
              </Box>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0B4F6C 0%, #083D54 100%)',
              color: 'white',
              border: 'none',
            }
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: 'linear-gradient(180deg, #0B4F6C 0%, #083D54 100%)',
              color: 'white',
              border: 'none',
              mt: '64px',
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: { xs: 2, sm: 3, md: 4 }, 
        mt: { xs: '56px', md: '64px' },
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }
      }}>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
