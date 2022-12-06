import { useAppSelector } from 'hooks';
import { getAssetSummaries } from 'modules/asset';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { pieChartActiveShape } from 'components/custom/CustomPieChart';
import { pieChartColors as colors } from 'lib';
import { Stack, Typography } from '@mui/material';

interface StockPieChartType {
  name: string;
  value: number;
}

const StockPieChart = () => {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<Array<StockPieChartType>>([]);

  useEffect(() => {
    if (assetSummaries.length > 0) {
      const _assetSummaryStocks = [
        ...assetSummaries[assetSummaries.length - 1].stocks,
      ];
      _assetSummaryStocks.sort(
        (a, b) =>
          b.currentPrice * b.shares * b.currency -
          a.currentPrice * a.shares * a.currency
      );

      _assetSummaryStocks.map((stock) => ({
        name: stock.companyName,
        value: stock.currentPrice * stock.shares * stock.currency,
      }));

      const _data = [];
      for (let i = 0; i < _assetSummaryStocks.length; i++) {
        if (i < 6) {
          _data.push({
            name: _assetSummaryStocks[i].companyName,
            value:
              _assetSummaryStocks[i].currentPrice *
              _assetSummaryStocks[i].shares *
              _assetSummaryStocks[i].currency,
          });
        } else {
          if (!_data[6]) {
            _data.push({
              name: 'Etc.',
              value:
                _assetSummaryStocks[i].currentPrice *
                _assetSummaryStocks[i].shares *
                _assetSummaryStocks[i].currency,
            });
          } else {
            _data[6].value +=
              _assetSummaryStocks[i].currentPrice *
              _assetSummaryStocks[i].shares *
              _assetSummaryStocks[i].currency;
          }
        }
      }
      setData(_data);
    }
  }, [assetSummaries]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return data.length > 0 ? (
    <ResponsiveContainer height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={pieChartActiveShape}
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={80}
          outerRadius={100}
          dataKey='value'
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <Stack direction='column' alignItems='center' sx={{ m: 2 }}>
      <Typography variant='guideline' align='center'>
        Please add stocks to see the pie chart.
      </Typography>
    </Stack>
  );
};

export default StockPieChart;
