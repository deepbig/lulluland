import React from 'react';
import { Box } from '@mui/material';
import SignUp from 'components/auth/SignUp';
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
          <SignUp />
        </MainFormLayout>
      </Box>
    </Box>
  );
}

export default SingInPage;
