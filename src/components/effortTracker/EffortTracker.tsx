import { Box, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import Title from 'components/title/Title';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import { UserData } from 'types';
import Achievements from './achievements/Achievements';
import ActivityAddForm from './activityBoard/ActivityAddForm';
import ActivityBoard from './activityBoard/ActivityBoard';
import MonthlyActivityChart from './monthlyActivityChart/MonthlyActivityChart';
import ActivityTrend from './activityTrend/ActivityTrend';
import PerformanceAddForm from './performanceTrends/PerformanceAddForm';
import PerformanceTrends from './performanceTrends/PerformanceTrends';
import RecentActivity from './recentActivity/RecentActivity';
import YearlySummary from './yearlySummary/YearlySummary';
import { getSelectedYear } from 'modules/activity';

type EffortTrackerProps = {
  username: string | undefined;
  selectedCategory: string;
  selectedUser: UserData | null;
};

function EffortTracker({
  username,
  selectedCategory,
  selectedUser,
}: EffortTrackerProps) {
  const theme = useTheme();
  const [openActivityForm, setOpenActivityForm] = useState(false);
  const [openPerformanceForm, setOpenPerformanceForm] = useState(false);
  const user = useAppSelector(getUser);
  const isMiddleWidth = useMediaQuery(theme.breakpoints.down('lg'));
  const selectedYear = useAppSelector(getSelectedYear);
  // const [openAchievementForm, setOpenAcehivementForm] = useState(false);

  return (
    <Grid container direction='row' spacing={3}>
      <Grid item xs={12} lg={8}>
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
              Effort Tracker
              {selectedCategory ? ` | ${selectedCategory}` : ''}
            </Title>
          ) : (
            <Title>
              Effort Tracker
              {selectedCategory ? ` | ${selectedCategory}` : ''}
            </Title>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              overflow: 'hidden',
            }}
          >
            <ActivityBoard category={selectedCategory} />
            {openActivityForm ? (
              <ActivityAddForm
                open={openActivityForm}
                handleClose={() => setOpenActivityForm(false)}
                selectedCategory={selectedCategory}
              />
            ) : null}
          </Box>
          <Box p={1}>
            <YearlySummary
              category={selectedCategory}
              uid={selectedUser?.uid ? selectedUser.uid : ''}
            />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
          elevation={4}
        >
          <Title>
            Monthly Activity Chart (
            {`${new Date().getMonth() + 1}/${
              selectedYear ? selectedYear : new Date().getFullYear()
            }`}
            ){selectedCategory ? ` | ${selectedCategory}` : ''}
          </Title>
          <MonthlyActivityChart selectedCategory={selectedCategory} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
          elevation={4}
        >
          <Title>
            Activity Trends {selectedCategory ? ` | ${selectedCategory}` : ''}
          </Title>
          <ActivityTrend
            selectedCategory={selectedCategory}
            selectedUser={selectedUser}
          />
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('lg')]: {
              height: 393,
            },
            overflow: 'hidden',
            overflowY: 'auto',
          }}
          elevation={4}
        >
          <Title>
            Recent Activity {selectedCategory ? ` | ${selectedCategory}` : ''}
          </Title>
          <RecentActivity category={selectedCategory} username={username} />
        </Paper>
      </Grid>

      {isMiddleWidth && (
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 330,
              overflow: 'hidden',
              overflowY: 'auto',
            }}
            elevation={4}
          >
            <Title>
              Objectives {selectedCategory ? ` | ${selectedCategory}` : ''}
            </Title>
            <Achievements category={selectedCategory} />
          </Paper>
        </Grid>
      )}

      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
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
