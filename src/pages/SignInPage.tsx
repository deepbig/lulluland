import React from 'react';
import { Box, useTheme } from '@mui/material';
import SignIn from 'components/auth/SignIn';
import MainFormLayout from 'layout/MainFormLayout';

function SingInPage() {
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
          <SignIn />
        </MainFormLayout>
      </Box>
    </Box>
  );
}

export default SingInPage;
