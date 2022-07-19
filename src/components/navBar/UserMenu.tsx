import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import MainCard from 'components/customCards/MainCard';
import { auth } from 'db';
import { signOutUser } from 'db/repositories/auth';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser, setUser } from 'modules/user';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from 'db/repositories/user';
import { setSnackbar } from 'modules/snackbar';

function UserMenu() {
  const currentUser = auth.currentUser;
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const [openProfileForm, setOpenProfileForm] = useState(false);
  const [profileValues, setProfileValues] = useState({
    title: user?.title || '',
    bio: user?.bio || '',
  });
  const [loading, setLoading] = useState(false);

  const handleAvatarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOutUser();
    navigate('/signin');
  };

  const handleProfile = () => {
    // change fields values
    setOpenProfileForm(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileValues({
      ...profileValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async () => {
    // update user profile
    if (currentUser) {
      setLoading(true);
      let user = await updateUserProfile(currentUser.uid, profileValues);
      if (user) {
        dispatch(setUser(user));
        setOpenProfileForm(false);
        handleCancel();
      } else {
        dispatch(
          setSnackbar({
            open: true,
            severity: 'error',
            message: 'Something went wrong. Please try again.',
          })
          );
        }
        setLoading(false);
      }
  };

  const handleCancel = () => {
    setOpenProfileForm(false);
    setProfileValues({
      title: user?.title || '',
      bio: user?.bio || '',
    });
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
        <Avatar
          alt='Profile Image'
          src={
            currentUser?.photoURL
              ? currentUser.photoURL
              : '/anonymous_user_avatar.png'
          }
        />
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
              <Stack direction='column' alignItems='center'>
                <Typography variant='h5'>{user?.displayName}</Typography>
                {openProfileForm ? (
                  <>
                    <TextField
                      label='Title'
                      size='small'
                      fullWidth
                      name='title'
                      variant='outlined'
                      value={profileValues.title}
                      onChange={handleChange}
                      sx={{ margin: '8px 0px' }}
                    />
                    <TextField
                      label='Bio'
                      size='small'
                      fullWidth
                      name='bio'
                      variant='outlined'
                      value={profileValues.bio}
                      onChange={handleChange}
                      multiline
                      maxRows={4}
                      sx={{ margin: '8px 0px' }}

                    />
                  </>
                ) : (
                  <Typography variant='subtitle2'>{user?.title}</Typography>
                )}
              </Stack>

              {openProfileForm ? null : user?.bio ? (
                <Card
                  sx={{ backgroundColor: theme.palette.primary.dark, my: 2 }}
                >
                  <CardContent>
                    <Typography variant='body1' gutterBottom>
                      <b>Who is {user?.displayName}?</b>
                    </Typography>
                    <Typography variant='body2'>{user?.bio}</Typography>
                  </CardContent>
                </Card>
              ) : null}

              <Box display='flex' justifyContent='center'>
                {openProfileForm ? (
                  <>
                    <LoadingButton
                      variant='outlined'
                      loading={loading}
                      onClick={handleSave}
                      sx={{ marginRight: 1 }}
                    >
                      Save
                    </LoadingButton>
                    <Button variant='outlined' onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant='outlined'
                      onClick={handleProfile}
                      sx={{ marginRight: 1 }}
                    >
                      Edit Profile
                    </Button>
                    <Button variant='outlined' onClick={handleLogout}>
                      Sign out
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </MainCard>
        </Paper>
      </Popover>
    </>
  );
}

export default UserMenu;
