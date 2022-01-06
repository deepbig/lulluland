import * as React from 'react';
import {
  Paper,
  Grid,
  Container,
  Typography,
  Box,
  Toolbar,
} from '@mui/material';
import EffortTracker from 'components/effortTracker/EffortTracker';
import Title from 'components/title/Title';
import PerformanceTrends from 'components/performanceTrends/PerformanceTrends';
import NavBar from 'components/navBar/NavBar';
import YearlySummary from 'components/yearlySummary/YearlySummary';
import Achievements from 'components/achievements/Achievements';

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

function DashboardContent() {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        {/* start */}
        <NavBar />

        {/* end */}
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
          <Toolbar />
          <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
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
                      <Title>Workout Tracker</Title>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row-reverse',
                          overflow: 'hidden',
                        }}
                      >
                        {/* TODO - year selection: current, 2022, 2021 */}
                        <EffortTracker />
                      </Box>
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
                            height: 311,
                            overflow: 'hidden',
                            overflowY: 'auto',
                          }}
                          elevation={4}
                        >
                          <Title>Summary of Year</Title>
                          <YearlySummary />
                        </Paper>
                      </Grid>
                      {/* Achievements */}
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 311,
                            overflow: 'hidden',
                            overflowY: 'auto',
                          }}
                          elevation={4}
                        >
                          <Title>Achievements</Title>
                          <Achievements />
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
                    flexDirection: 'column',
                  }}
                  elevation={4}
                >
                  <Title>Performance Trends</Title>
                  <PerformanceTrends />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
