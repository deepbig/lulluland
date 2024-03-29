import React from 'react';
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { Card, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { PerformanceData } from 'types';

interface performanceChartProps {
  data: PerformanceData[];
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div>
        <Card sx={{ backgroundColor: grey[800], border: 'none' }}>
          <CardContent style={{ padding: 7 }}>
            <Typography variant='body2'>
              {payload && payload[0] && payload[0].payload.date}
            </Typography>
            <Typography variant='body2'>
              desc: {payload && payload[0] && payload[0].payload.note}
            </Typography>
            <Typography variant='body2'>
              counts: {payload && payload[0] && payload[0].value} reps
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
};

function PerformanceChart(props: performanceChartProps) {
  const { data } = props;
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
          <Tooltip content={<CustomTooltip />}
          />
          <Line
            isAnimationActive={false}
            type='monotone'
            dataKey='performance'
            stroke='white'
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default PerformanceChart;
