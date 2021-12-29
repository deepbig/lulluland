import React from 'react';
import { Grid, Typography, Avatar, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Title from 'components/title/Title';
import PerformanceChart from 'components/performanceChart/PerformanceChart';

function PerformanceTrends() {
  return (
    <>
      <Grid container direction='column'>
        <Grid item>
          <Grid container justifyContent='space-between'>
            <Grid item>
              <Title>Performance Trends</Title>
            </Grid>
            <Grid item>
              <Typography>Selection List</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container alignItems='center'>
            <Grid item xs={6}>
              <Grid container alignItems='center'>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: '2.125rem',
                      fontWeight: 500,
                      mr: 1,
                      mt: 0.75,
                      mb: 0.75,
                    }}
                  >
                    12 reps
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    sx={{
                      fontSize: '1.5rem',
                      fontWeight: 500,
                      mr: 1,
                      mt: 0.75,
                      mb: 0.75,
                    }}
                  >
                    10%
                  </Typography>
                </Grid>
                <Grid item>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <ArrowForwardIcon
                      fontSize='inherit'
                      sx={{ transform: 'rotate(-45deg)' }}
                    />
                  </Avatar>
                </Grid>
                <Grid item xs={12}>
                  <Typography>from the previous record.</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  height: 150,
                }}
              >
                <PerformanceChart />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default PerformanceTrends;
