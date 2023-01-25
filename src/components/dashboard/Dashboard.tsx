import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Toolbar,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Box,
} from '@mui/material';
import { CategoryData } from 'types';
import { getUserFromDB } from 'db/repositories/user';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setBackdrop } from 'modules/backdrop';
import { useNavigate } from 'react-router-dom';
import { chipColors } from 'lib';
import EffortTracker from 'components/effortTracker/EffortTracker';
import AssetTracker from 'components/assetTracker/AssetTracker';
import { getSelectedUser, getUser, setSelectedUser } from 'modules/user';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { grey, green } from '@mui/material/colors';
import CategoryAddForm from 'components/effortTracker/categoryAddForm/CategoryAddForm';

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedUser = useAppSelector(getSelectedUser);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );
  const user = useAppSelector(getUser);
  const [categoryAddForm, setCategoryAddForm] = useState(false);

  useEffect(() => {
    const getSelectedUser = async () => {
      dispatch(setBackdrop(true));
      const fetchedUser = await getUserFromDB(username ? username : 'deepbig');
      if (fetchedUser) {
        dispatch(setSelectedUser(fetchedUser));
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
          <Box>
            {type === 'effort-tracker' ? (
              <Grid
                container
                direction='row'
                justifyContent='center'
                alignItems='center'
                spacing={1}
              >
                <Grid item>
                  <Chip
                    sx={{
                      backgroundColor: selectedCategory
                        ? grey[500]
                        : green[500],
                    }}
                    label='ALL'
                    size='small'
                    onClick={() => setSelectedCategory(null)}
                  />
                </Grid>
                {selectedUser?.categories.map((category, i) => (
                  <Grid key={i} item>
                    <Chip
                      sx={{
                        backgroundColor:
                          !selectedCategory ||
                          selectedCategory.category === category.category
                            ? chipColors[category.color]
                            : grey[500],
                      }}
                      label={category.category}
                      size='small'
                      onClick={() => setSelectedCategory(category)}
                    />
                  </Grid>
                ))}
                {user && user.username === username ? (
                  <Grid item>
                    <IconButton
                      sx={{ padding: 0 }}
                      onClick={() => setCategoryAddForm(true)}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Grid>
                ) : null}
              </Grid>
            ) : null}
          </Box>
        </Stack>

        {type === 'effort-tracker' ? (
          <EffortTracker
            username={username}
            selectedCategory={selectedCategory}
          />
        ) : null}
        {type === 'asset-tracker' ? <AssetTracker /> : null}

        {categoryAddForm && (
          <CategoryAddForm
            open={categoryAddForm}
            handleClose={() => setCategoryAddForm(false)}
          />
        )}

        <Copyright sx={{ pt: 4 }} />
      </Container>
    </>
  );
}
