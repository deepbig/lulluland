import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Toolbar,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import { UserData } from 'types';
import { getUserFromDB } from 'db/repositories/user';
import { useAppDispatch } from 'hooks';
import { setBackdrop } from 'modules/backdrop';
import { useNavigate } from 'react-router-dom';
import { chipColors } from 'lib';
import EffortTracker from 'components/effortTracker/EffortTracker';
import AssetTracker from 'components/assetTracker/AssetTracker';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='GrayText.secondary'
      align='center'
      {...props}
    >
      {'Copyright © Hongsuk Ryu ' + new Date().getFullYear() + '.'}
    </Typography>
  );
}

type DashboardProps = {
  username: string | undefined;
  type: string | undefined;
};

export default function Dashboard({ username, type }: DashboardProps) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const getSelectedUser = async () => {
      dispatch(setBackdrop(true));
      const fetchedUser = await getUserFromDB(username ? username : 'deepbig');
      if (fetchedUser) {
        setSelectedUser(fetchedUser);
        dispatch(setBackdrop(false));
      } else {
        navigate('/404');
        dispatch(setBackdrop(false));
      }
    };
    getSelectedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return (
    <>
      <Toolbar />
      <Container maxWidth={'xl'} sx={{ mt: 2, mb: 4 }}>
        <Stack direction='column' alignItems='center' sx={{ marginBottom: 2 }}>
          {selectedUser ? (
            <Avatar
              alt='Profile Image'
              sx={{ width: 56, height: 56 }}
              src={
                selectedUser?.photoURL
                  ? selectedUser.photoURL
                  : '/anonymous_user_avatar.png'
              }
            />
          ) : null}
          <Typography variant='h5'>{selectedUser?.displayName}</Typography>
          <Typography variant='guideline' gutterBottom>
            {selectedUser?.username}
          </Typography>
          {type === 'effort-tracker' ? (
            <Stack direction='row' spacing={1}>
              {selectedUser?.categories.map((category, i) => (
                <Chip
                  key={i}
                  sx={{ backgroundColor: chipColors[i % chipColors.length] }}
                  label={category}
                  size='small'
                  onClick={() => setSelectedCategory(category)}
                />
              ))}
            </Stack>
          ) : null}
        </Stack>

        {type === 'effort-tracker' ? (
          <EffortTracker
            username={username}
            selectedCategory={selectedCategory}
            selectedUser={selectedUser}
          />
        ) : null}
        {type === 'asset-tracker' ? (
          <AssetTracker username={username} selectedUser={selectedUser} />
        ) : null}

        <Copyright sx={{ pt: 4 }} />
      </Container>
    </>
  );
}
