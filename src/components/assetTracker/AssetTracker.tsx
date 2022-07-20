import { Grid, Paper } from '@mui/material';
import Title from 'components/title/Title';
import React from 'react';
import { UserData } from 'types';
import AssetTrend from './assetTrend.tsx/AssetTrend';

type AssetTrackerProps = {
  username: string | undefined;
  selectedUser: UserData | null;
};

function AssetTracker({ username, selectedUser }: AssetTrackerProps) {
  return (
    <Grid container direction='row' spacing={3}>
      {/* Asset Trend */}
      <Grid item xs={12} lg={8}>
        <Paper elevation={4}>
          <Title>Asset Trends</Title>
          <AssetTrend />
        </Paper>
      </Grid>

      {/* Monthly Summary */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={4}>
          <Title>Monthly Summary</Title>
          <AssetTrend />
        </Paper>
      </Grid>

      {/* Asset Chart */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={4}>
          <Title>Asset Chart</Title>
          <AssetTrend />
        </Paper>
      </Grid>

      {/* Monthly Expense Chart */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={4}>
          <Title>Monthly Expense Chart</Title>
          <AssetTrend />
        </Paper>
      </Grid>

      {/* Monthly Expense Trend: 2-lines chart, min / avg / max of year  */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={4}>
          <Title>Monthly Expense Trend</Title>
          <AssetTrend />
        </Paper>
      </Grid>

      {/* stock value trends: icon, buy-value, current-value, today's change(%), my value change(%), trade history, total income/loss, actual income/loss  */}
      <Grid item xs={12}>
        <Paper elevation={4}>
          <Title>Stock value trends</Title>
          <AssetTrend />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AssetTracker;
