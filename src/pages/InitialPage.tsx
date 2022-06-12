import React from 'react';
import { Box } from '@mui/material';
import MainFormLayout from 'layout/MainFormLayout';
import InitialSteps from 'components/initialSteps/InitialSteps';

function InitialPage() {
  return (
    <Box sx={{ display: 'flex' }}>
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
        <MainFormLayout>
          <InitialSteps />
        </MainFormLayout>
      </Box>
    </Box>
  );
}

export default InitialPage;
