import React from 'react';
import { Box, Typography } from '@mui/material';
import MainFormLayout from 'layout/MainFormLayout';

function NotFoundPage() {
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
          <Typography>Sorry, we couldn&#039;t find that page</Typography>
        </MainFormLayout>
      </Box>
    </Box>
  );
}

export default NotFoundPage;
