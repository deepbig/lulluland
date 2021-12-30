import React from 'react';
import { useTheme } from '@mui/material/styles';
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

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className='custom-tooltip'>
        <p className='label'>{`${label} : ${
          payload && payload[0] ? payload[0].value : 'N/A'
        }`}</p>
      </div>
    );
  }
  return null;
};

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
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.9)',
              fontSize: 12,
              borderRadius: 10,
            }}
            labelStyle={{ color: 'white' }}
          />
          <Line
            isAnimationActive={false}
            type='monotone'
            dataKey='amount'
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
