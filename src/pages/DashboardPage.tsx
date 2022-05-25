import React from 'react';
import Dashboard from 'components/dashboard/Dashboard';
import { Box } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';

function DashboardPage() {
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
      <Dashboard />
      </Box>
    </Box>
      );
}

export default DashboardPage;
