import React, { useEffect } from 'react';
import Dashboard from 'components/dashboard/Dashboard';
import { Box } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';

function DashboardPage() {
  const { username, type } = useParams();
  const user = useAppSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      if (user) {
        navigate(`/dashboard/${user.username}/effort-tracker`);
      } else {
        navigate(`/dashboard/deepbig/effort-tracker`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  //

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
        <Dashboard username={username} type={type} />
      </Box>
    </Box>
  );
}

export default DashboardPage;
