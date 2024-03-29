import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useAppSelector } from 'hooks';
import { numWithCommas, selectStockColor } from 'lib';
import { getAssetSummaries } from 'modules/asset';
import React, { useEffect, useState } from 'react';
import { StockCountryTypes, StockData, StockHistoryData } from 'types';
import { getStockHistories } from 'modules/stockHistory';
import StockPieChart from './StockPieChart';
import StockHistoryPieChart from './StockHistoryPieChart';

type profitLossType = {
  value: number | string;
  percent: number | string;
};

/**
 * 매일 주가 변공에 따른 값 변경 (매입가 입력, 매매가 입력 시 실현손익 계산)
 * @returns
 */
function StockValueTrends() {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const stockHistories = useAppSelector(getStockHistories);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [totalProfitLoss, setTotalProfitLoss] = useState<profitLossType>({
    value: 0,
    percent: 0,
  });
  const [actualProfitLoss, setActualProfitLoss] = useState<profitLossType>({
    value: 0,
    percent: 0,
  });

  useEffect(() => {
    if (assetSummaries?.length > 0) {
      const _assetSummaryStocks = [
        ...assetSummaries[assetSummaries.length - 1].stocks,
      ];
      _assetSummaryStocks.sort(
        (a, b) =>
          b.currentPrice * b.shares * b.currency -
          a.currentPrice * a.shares * a.currency
      );

      setStocks(_assetSummaryStocks);
      setTotalProfitLoss(getTotalProfitLoss(_assetSummaryStocks));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSummaries]);

  useEffect(() => {
    if (stockHistories?.length > 0) {
      setActualProfitLoss(getActualProfitLoss(stockHistories));
    }
  }, [stockHistories]);

  // total Profit/Loss: 매입가 - 매매가
  const getTotalProfitLoss = (stocks: StockData[]) => {
    let begin, end, value, percent;
    begin = end = value = percent = 0;
    for (const stock of stocks) {
      // currentPrice가 없으면 currency 값도 없기 때문에 부정확한 값이 나옴.
      // 따라서 값을 표기하지 않도록 수정.
      if (stock.currentPrice) {
        begin += stock.buyPrice * stock.shares * stock.currency;
        end += stock.currentPrice * stock.shares * stock.currency;
      }
    }
    value = (end - begin).toFixed(0);
    // calculate percentage of change from begin to end
    percent = begin ? (((end - begin) / begin) * 100).toFixed(2) : 0;

    return { value, percent } as profitLossType;
  };

  const getActualProfitLoss = (stocks: StockHistoryData[]) => {
    let begin, end, value, percent;
    begin = end = value = percent = 0;
    for (const stock of stocks) {
      // currentPrice가 없으면 currency 값도 없기 때문에 부정확한 값이 나옴.
      // 따라서 값을 표기하지 않도록 수정.
      if (stock.sellPrice) {
        begin += stock.buyPrice * stock.shares * stock.currency;
        end += stock.sellPrice * stock.shares * stock.currency;
      }
    }
    value = (end - begin).toFixed(0);
    // calculate percentage of change from begin to end
    percent = begin ? (((end - begin) / begin) * 100).toFixed(2) : 0;
    return { value, percent } as profitLossType;
  };

  return (
    <>
      {assetSummaries.length > 0 && (
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='center'
          spacing={2}
        >
          <Grid item xs={12} md={6}>
            <Typography variant='h6' align='center' gutterBottom>
              Total Profit/Loss: ₩{' '}
              {`${numWithCommas(totalProfitLoss.value)} (${
                totalProfitLoss.percent
              }%)`}
            </Typography>
            <StockPieChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' align='center' gutterBottom>
              Actual Profit/Loss: ₩{' '}
              {`${numWithCommas(actualProfitLoss.value)} (${
                actualProfitLoss.percent
              }%)`}
            </Typography>
            <StockHistoryPieChart />
          </Grid>
        </Grid>
      )}
      <Grid container direction='row' spacing={2}>
        {stocks.length > 0 &&
          stocks.map((stock) => (
            <Grid key={stock.symbol} item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography noWrap>{stock.companyName}</Typography>
                    <Typography>
                      Current Price:{' '}
                      {stock.currentPrice
                        ? `${
                            stock.country === StockCountryTypes.USA ? '$' : '₩'
                          } ${numWithCommas(stock.currentPrice)}`
                        : '-'}
                    </Typography>
                    <Typography>
                      Total Amount:{' '}
                      {stock.currentPrice
                        ? `${
                            stock.country === StockCountryTypes.USA ? '$' : '₩'
                          } ${numWithCommas(
                            (stock.currentPrice * stock.shares).toFixed(0)
                          )}`
                        : '-'}
                    </Typography>
                    <Typography
                      color={
                        stock.currentPrice
                          ? selectStockColor(
                              stock.currentPrice - stock.buyPrice
                            )
                          : ''
                      }
                    >
                      Profit/Loss:{' '}
                      {stock.currentPrice
                        ? `₩ ${numWithCommas(
                            (
                              (stock.currentPrice - stock.buyPrice) *
                              stock.currency *
                              stock.shares
                            ).toFixed(0)
                          )} (${(
                            ((stock.currentPrice - stock.buyPrice) /
                              stock.buyPrice) *
                            100
                          ).toFixed(2)})`
                        : '-'}
                      %
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default StockValueTrends;
