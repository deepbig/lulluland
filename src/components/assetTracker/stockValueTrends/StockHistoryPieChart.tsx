import { useAppSelector } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { numFormatter, pieChartColors as colors, selectStockColor } from 'lib';
import { Box, Stack, Typography } from '@mui/material';
import { getStockHistories } from 'modules/stockHistory';

interface StockPieChartType {
  name: string;
  value: number;
  profit: number;
}

export const pieChartActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text
        x={cx}
        y={cy}
        dy={-18}
        textAnchor='middle'
        fill={fill}
        fontSize={20}
        style={{
          textShadow:
            '-1px 0 #121212, 0 1px #121212, 1px 0 #121212, 0 -1px #121212',
        }}
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy}
        dy={5}
        textAnchor='middle'
        fill={selectStockColor(payload.profit)}
      >
        {payload.profit < 0 ? 'Loss: -' : 'Profit:'}
        {' ₩ ' + numFormatter(payload.profit)}
      </text>
      <text x={cx} y={cy} dy={25} textAnchor='middle' fill='#999'>
        {`(Rate ${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

const StockHistoryPieChart = () => {
  const stockHistories = useAppSelector(getStockHistories);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<Array<StockPieChartType>>([]);

  useEffect(() => {
    if (stockHistories.length > 0) {
      const _stockHistories = [...stockHistories];

      // Sort by profit, but scale by total value.
      _stockHistories.sort(
        (a, b) =>
          (b.sellPrice - b.buyPrice) * b.shares * b.currency -
          (a.sellPrice - a.buyPrice) * a.shares * a.currency
      );

      const _data = [];
      let stockHistory;
      for (let i = 0; i < _stockHistories.length; i++) {
        stockHistory = _stockHistories[i];
        if (i < 6) {
          _data.push({
            name: stockHistory.companyName,
            value:
              stockHistory.sellPrice *
              stockHistory.shares *
              stockHistory.currency,
            profit:
              (stockHistory.sellPrice - stockHistory.buyPrice) *
              stockHistory.shares *
              stockHistory.currency,
          });
        } else if (i === 6) {
          _data.push({
            name: 'Etc.',
            value:
              stockHistory.sellPrice *
              stockHistory.shares *
              stockHistory.currency,
            profit:
              (stockHistory.sellPrice - stockHistory.buyPrice) *
              stockHistory.shares *
              stockHistory.currency,
          });
        } else {
          _data[6].value +=
            stockHistory.sellPrice *
            stockHistory.shares *
            stockHistory.currency;
          _data[6].profit +=
            (stockHistory.sellPrice - stockHistory.buyPrice) *
            stockHistory.shares *
            stockHistory.currency;
        }
      }
      setData(_data);
    }
  }, [stockHistories]);

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
    <Stack direction='column' alignItems='center'>
      <Box sx={{ display: 'flex', alignItems: 'center', height: 300 }}>
        <Typography variant='guideline' align='center'>
          Please sell some stocks to see the pie chart.
        </Typography>
      </Box>
    </Stack>
  );
};

export default StockHistoryPieChart;
