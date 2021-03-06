import React, { useEffect, useState } from 'react';
import {
  Paper,
  Grid,
  Container,
  Typography,
  Box,
  Toolbar,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';
import EffortTracker from 'components/effortTracker/EffortTracker';
import Title from 'components/title/Title';
import PerformanceTrends from 'components/performanceTrends/PerformanceTrends';
import YearlySummary from 'components/yearlySummary/YearlySummary';
import Achievements from 'components/achievements/Achievements';
import { useTheme } from '@mui/material/styles';
import { UserData } from 'types';
import { getUserFromDB } from 'db/repositories/user';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setBackdrop } from 'modules/backdrop';
import { useNavigate } from 'react-router-dom';
import { chipColors } from 'lib';
import ActivityAddForm from 'components/effortTracker/ActivityAddForm';
import { getUser } from 'modules/user';
import PerformanceAddForm from 'components/performanceTrends/PerformanceAddForm';
import RecentActivity from 'components/recentActivity/RecentActivity';

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
};

export default function Dashboard({ username }: DashboardProps) {
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openActivityForm, setOpenActivityForm] = useState(false);
  const [openPerformanceForm, setOpenPerformanceForm] = useState(false);
  const user = useAppSelector(getUser);
  // const [openAchievementForm, setOpenAcehivementForm] = useState(false);

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
        </Stack>

        <Grid container direction='row' spacing={3}>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={3}>
              {/* Effort Tracker */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  elevation={4}
                >
                  {user && user.username === username ? (
                    <Title buttonFunction={() => setOpenActivityForm(true)}>
                      {selectedCategory ? selectedCategory : 'Effort'} Tracker
                    </Title>
                  ) : (
                    <Title>
                      {selectedCategory ? selectedCategory : 'Effort'} Tracker
                    </Title>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      overflow: 'hidden',
                    }}
                  >
                    {/* TODO - year selection: current, 2022, 2021 */}
                    <EffortTracker
                      category={selectedCategory}
                      uid={selectedUser?.uid ? selectedUser.uid : ''}
                    />
                    {openActivityForm ? (
                      <ActivityAddForm
                        open={openActivityForm}
                        handleClose={() => setOpenActivityForm(false)}
                        selectedCategory={selectedCategory}
                      />
                    ) : null}
                  </Box>
                </Paper>
              </Grid>
              {/* Summary of Year */}
              <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        overflowY: 'auto',
                      }}
                      elevation={4}
                    >
                      <Title>
                        Summary of Year{''}
                        {selectedCategory ? ` | ${selectedCategory}` : ''}
                      </Title>
                      <YearlySummary category={selectedCategory} />
                    </Paper>
                  </Grid> 
              {/* Summary of Year */}
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 255,
                        [theme.breakpoints.up('xl')]: {
                          height: 330,
                        },
                        overflow: 'hidden',
                        overflowY: 'auto',
                      }}
                      elevation={4}
                    >
                      <Title>
                        Recent Activity{' '}
                        {selectedCategory ? ` | ${selectedCategory}` : ''}
                      </Title>
                      <RecentActivity category={selectedCategory} username={username} />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 330,
                        [theme.breakpoints.between('md', 'xl')]: {
                          height: 255,
                        },
                        overflow: 'hidden',
                        overflowY: 'auto',
                      }}
                      elevation={4}
                    >
                      <Title>
                        Objectives{' '}
                        {selectedCategory ? ` | ${selectedCategory}` : ''}
                      </Title>
                      <Achievements category={selectedCategory} />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Performance Chart */}
          <Grid item xs={12} lg={4}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                minHeight: 160,
                [theme.breakpoints.between('lg','xl')]: {
                  height: 725,
                },
                [theme.breakpoints.up('xl')]: {
                  height: 795,
                },
                overflow: 'hidden',
                overflowY: 'auto',
              }}
              elevation={4}
            >
              {user && user.username === username ? (
                <Title buttonFunction={() => setOpenPerformanceForm(true)}>
                  Performance Trends
                </Title>
              ) : (
                <Title>Performance Trends</Title>
              )}
              <PerformanceTrends
                selectedCategory={selectedCategory}
                selectedUser={selectedUser ? selectedUser : null}
                username={username}
              />
              {openPerformanceForm ? (
                <PerformanceAddForm
                  open={openPerformanceForm}
                  handleClose={() => setOpenPerformanceForm(false)}
                  selectedCategory={selectedCategory}
                />
              ) : null}
            </Paper>
          </Grid>
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </>
  );
}
