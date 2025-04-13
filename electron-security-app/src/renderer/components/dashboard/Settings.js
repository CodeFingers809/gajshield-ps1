import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Stack, Chip } from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import { fetchUserData } from '../../../lib/supabase';
import { Shield, Timeline } from '@mui/icons-material';

function Settings() {
  const { user } = useUser();
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
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
    };
    loadData();
  }, [user]);

  if (loading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Account Settings</Typography>
      
      <Paper sx={{ p: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Avatar 
            src={user?.imageUrl} 
            sx={{ width: 100, height: 100 }}
          />
          <Box flex={1}>
            <Typography variant="h5" gutterBottom>{user?.fullName}</Typography>
            <Typography color="text.secondary" gutterBottom>
              {user?.emailAddresses[0]?.emailAddress}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip 
                icon={<Shield />}
                label="Security User"
                color="primary"
              />
              <Chip 
                icon={<Timeline />}
                label={`${userData?.total_scans || 0} Total Scans`}
                color="secondary"
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Settings;
