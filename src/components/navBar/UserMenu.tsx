import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import MainCard from 'components/customCards/MainCard';
import { auth } from 'db';
import { signOutUser } from 'db/repositories/auth';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserMenu() {
  const currentUser = auth.currentUser;
  const theme = useTheme();
  const [photoURL, setPhotoURL] = useState('/anonymous_user_avatar.png');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  const handleLogout = () => {
    signOutUser();
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <>
      <IconButton
        id='avatar-button'
        onClick={handleAvatarClick}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar alt='Profile Image' src={photoURL} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper>
          <MainCard>
            <Box sx={{ width: 300 }}>
              <Stack>
                <Stack direction='row' spacing={0.5} alignItems='center'>
                  <Typography variant='h5'>Hongsuk Ryu</Typography>
                </Stack>
                <Typography variant='subtitle2'>
                  Full-Stack Web Developer
                </Typography>
              </Stack>

              <Card sx={{ backgroundColor: theme.palette.primary.dark, my: 2 }}>
                <CardContent>
                  <Typography variant='body1' gutterBottom>
                    <b>Who is Hongsuk?</b>
                  </Typography>
                  <Grid container spacing={3} direction='column'>
                    <Grid item>
                      <Grid
                        item
                        container
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Grid item>
                          <Typography variant='subtitle2'>
                            주어진 시간을 계획하고 의미 있게 사용하는 것을
                            즐기는 3년 차 웹 (Frontend & Backend) 개발자
                            류홍석입니다. 현 직장인 실크로드 소프트에서 React
                            기반 Frontend와 Java Spring Boot 기반 Backend를
                            전담하여 개발하고 있습니다. Backend와 연동되는 Netty
                            기반 Server Manager Tool 개발에도 참여하고 있습니다.
                            전 직장인 Logitech에서 System Administrator 업무를
                            담당하였고, RPA를 사용하여 Process Automation 및
                            Data Analysis 작업을 수행하였습니다. 3년간 Bryant
                            University에서 Information Systems and Analytics
                            Tutor & Lab Assistant로서 학우들의 학업을 도와주는
                            역할을 수행하였습니다. Bryant University에서
                            Information Systems 전공 수석으로 졸업하였습니다.
                          </Typography>
                        </Grid>
                        <Grid item>
                          {/* need to create switch component */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </MainCard>
        </Paper>
      </Popover>
    </>
  );
}

export default UserMenu;
