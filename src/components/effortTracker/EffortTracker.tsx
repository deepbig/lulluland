import { Box, Grid, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Title from 'components/title/Title';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import { UserData } from 'types';
import Achievements from './achievements/Achievements';
import ActivityAddForm from './activityBoard/ActivityAddForm';
import ActivityBoard from './activityBoard/ActivityBoard';
import PerformanceAddForm from './performanceTrends/PerformanceAddForm';
import PerformanceTrends from './performanceTrends/PerformanceTrends';
import RecentActivity from './recentActivity/RecentActivity';
import YearlySummary from './yearlySummary/YearlySummary';

type EffortTrackerProps = {
  username: string | undefined;
  selectedCategory: string;
  selectedUser: UserData | null;
};

function EffortTracker({ username, selectedCategory, selectedUser }: EffortTrackerProps) {
  const theme = useTheme();
  const [openActivityForm, setOpenActivityForm] = useState(false);
  const [openPerformanceForm, setOpenPerformanceForm] = useState(false);
  const user = useAppSelector(getUser);
  // const [openAchievementForm, setOpenAcehivementForm] = useState(false);

  return (
    <Grid container direction='row' spacing={3}>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={3}>
          {/* Activity Board */}
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
                <ActivityBoard
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
                  <RecentActivity
                    category={selectedCategory}
                    username={username}
                  />
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
            [theme.breakpoints.between('lg', 'xl')]: {
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
  );
}

export default EffortTracker;
