import React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

function createData(time: string, amount?: number) {
  return { time, amount };
}

const data = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

function PerformanceChart() {
  const theme = useTheme();

  return (
    <>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Line
            isAnimationActive={false}
            type='monotone'
            dataKey='amount'
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default PerformanceChart;
