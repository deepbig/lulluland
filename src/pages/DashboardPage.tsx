import React, { useEffect } from 'react';
import Dashboard from 'components/dashboard/Dashboard';
import { Box } from '@mui/material';
import NavBar from 'components/navBar/NavBar';
import { PageName } from 'types';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import { drawerWidth } from 'lib';

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
  }, [username]);

  //

  return (
    <Box sx={{ display: 'flex' }}>
      <NavBar selectedName={PageName.EFFORT_TRACKER} />
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          overflow: 'auto',
        }}
      >
        <Dashboard username={username} type={type} />
      </Box>
    </Box>
  );
}

export default DashboardPage;
