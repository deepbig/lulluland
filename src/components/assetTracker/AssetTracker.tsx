import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import Title from 'components/title/Title';
import React, { useEffect, useState } from 'react';
import { UserData } from 'types';
import AssetChart from './assetPieChart/AssetPieChart';
import AssetTrend from './assetTrend/AssetTrend';
import MonthlyExpenseLineChart from './monthlyExpenseChart/MonthlyExpenseLineChart';
import MonthlyTrend from './monthlyTrend/MonthlyTrend';
import MonthlySummary from './monthlySummary/MonthlySummary';
import StockValueTrends from './stockValueTrends/StockValueTrends';
import { summaries } from 'db/repositories/asset';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setAssetSummaryList } from 'modules/asset';
import { setBackdrop } from 'modules/backdrop';
import AssetUpdateForm from './assetPieChart/AssetUpdateForm';
import EditIcon from '@mui/icons-material/Edit';
import { getUser } from 'modules/user';
import { givenMonthYearFormat } from 'lib';

type AssetTrackerProps = {
  username: string | undefined;
  selectedUser: UserData | null;
};

function AssetTracker({ username, selectedUser }: AssetTrackerProps) {
  const dispatch = useAppDispatch();
  const [openAssetEditForm, setOpenAssetEditForm] = useState(false);
  const user = useAppSelector(getUser);
  const currentMonthYear = givenMonthYearFormat(new Date().toString());

  useEffect(() => {
    if (selectedUser?.uid) {
      fetchAssets(selectedUser.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const fetchAssets = async (uid: string) => {
    dispatch(setBackdrop(true));
    const _summaries = await summaries(uid);
    dispatch(setAssetSummaryList(_summaries));
    // 일단 stock 가격은 유저가 입력값을 주도록 설정.
    dispatch(setBackdrop(false));
  };

  return (
    <Grid container direction='row' spacing={3}>
      {/* Asset Trend */}
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Asset Trends</Title>
          <AssetTrend selectedUser={selectedUser} />
        </Paper>
      </Grid>

      {/* Monthly Summary */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Monthly Summary ({currentMonthYear})</Title>
          <MonthlySummary selectedUser={selectedUser} />
        </Paper>
      </Grid>

      {/* Asset Chart */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Box display='flex' justifyContent='space-between'>
            <Typography component='h2' variant='h6' gutterBottom>
              Asset Chart ({currentMonthYear})
            </Typography>
            {user && selectedUser && user.uid === selectedUser.uid && (
              <IconButton onClick={() => setOpenAssetEditForm(true)}>
                <EditIcon />
              </IconButton>
            )}
          </Box>
          <AssetChart />
        </Paper>
        {openAssetEditForm && (
          <AssetUpdateForm
            open={openAssetEditForm}
            handleClose={() => setOpenAssetEditForm(false)}
          />
        )}
      </Grid>

      {/* Monthly Expense Chart */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Expense Chart ({currentMonthYear})</Title>
          <MonthlyExpenseLineChart />
        </Paper>
      </Grid>

      {/* Monthly Trend: bar chart (income, expenses for 6 months)  */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Monthly Trends</Title>
          <MonthlyTrend />
        </Paper>
      </Grid>

      {/* stock value trends: icon, buy-value, current-value, today's change(%), my value change(%), trade history, total income/loss, actual income/loss  */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Stock Value Trends</Title>
          <StockValueTrends />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AssetTracker;
