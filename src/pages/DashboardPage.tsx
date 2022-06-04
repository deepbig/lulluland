import React from 'react';
import Dashboard from 'components/dashboard/Dashboard';
import { Box } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';
import { useParams } from 'react-router-dom';

function DashboardPage() {
  const { username } = useParams();

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.EFFORT_TRACKER} />
      <Box
        component='main'
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Dashboard username={username} />
      </Box>
    </Box>
  );
}

export default DashboardPage;
