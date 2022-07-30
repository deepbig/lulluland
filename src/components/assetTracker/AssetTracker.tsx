import { Grid, Paper } from '@mui/material';
import Title from 'components/title/Title';
import React, { useEffect } from 'react';
import { StockCountryTypes, StockTypes, UserData } from 'types';
import AssetChart from './assetPieChart/AssetPieChart';
import AssetTrend from './assetTrend/AssetTrend';
import MonthlyExpenseChart from './monthlyExpensePieChart/MonthlyExpensePieChart';
import MonthlyExpenseTrend from './monthlyExpenseTrend/MonthlyExpenseTrend';
import MonthlySummary from './monthlySummaryPieChart/MonthlySummaryPieChart';
import StockValueTrends from './stockValueTrends/StockValueTrends';
import { current, summaries } from 'db/repositories/asset';
import { useAppDispatch } from 'hooks';
import { setAssetList, setAssetSummaryList } from 'modules/asset';
import { setBackdrop } from 'modules/backdrop';

type AssetTrackerProps = {
  username: string | undefined;
  selectedUser: UserData | null;
};

function AssetTracker({ username, selectedUser }: AssetTrackerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedUser?.uid) {
      fetchAssets(selectedUser.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  const fetchAssets = async (uid: string) => {
    dispatch(setBackdrop(true));
    const _assets = await current(uid);
    dispatch(setAssetList(_assets));
    const _summaries = await summaries(uid);
    dispatch(setAssetSummaryList(_summaries));
    if (_summaries.length > 0) {
      // current Price 업데이트 필요. 여기서 업데이트를 해줘야
      const updatedSummaries = [..._summaries];
      for (const stock of _summaries[_summaries.length - 1].stocks) {
        const location =
          stock.country === StockCountryTypes.KOR ? 'domestic' : 'worldstock';
        const _realtimePrices = await fetch(
          `https://cors-anywhere.herokuapp.com/https://polling.finance.naver.com/api/realtime/${location}/${stock.type}/${stock.symbol}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0',
            },
          }
        ).catch((e) => {
          console.log(e);
          // 없으면 패스
        });
        console.log(_realtimePrices);
        // if (_realtimePrices?.datas?.closePrice) {
        //   stock.currentPrice = _realtimePrices.datas[0].closePrice;

        // }
      }
    }
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
          <Title>Monthly Summary</Title>
          <MonthlySummary />
        </Paper>
      </Grid>

      {/* Asset Chart */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Asset Chart</Title>
          <AssetChart />
        </Paper>
      </Grid>

      {/* Monthly Expense Chart */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Monthly Expense Chart</Title>
          <MonthlyExpenseChart />
        </Paper>
      </Grid>

      {/* Monthly Expense Trend: 2-lines chart, min / avg / max of year  */}
      <Grid item xs={12} md={6} lg={4}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Monthly Expense Trend</Title>
          <MonthlyExpenseTrend />
        </Paper>
      </Grid>

      {/* stock value trends: icon, buy-value, current-value, today's change(%), my value change(%), trade history, total income/loss, actual income/loss  */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }} elevation={4}>
          <Title>Stock value trends</Title>
          <StockValueTrends />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AssetTracker;
