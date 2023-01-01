import { useAppSelector } from 'hooks';
import { getActivities, getSelectedYear } from 'modules/activity';
import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { chipColors as colors, numFormatter, numWithCommas } from 'lib/index';
import { Card, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { CategoryData } from 'types';

interface ActivityChartData {
  name: string;
  previous: number;
  current?: number;
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
              {payload && payload[0] && payload[0].payload.name}
            </Typography>

            {payload?.map((payload, idx) => (
              <Typography
                key={idx}
                variant='body2'
                style={{ color: payload.color }}
              >
                {payload.name}: {numWithCommas(payload.value as number)} mins
              </Typography>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
};

function MonthlyActivityChart({
  selectedCategory,
}: {
  selectedCategory: CategoryData | null;
}) {
  const [data, setData] = useState<ActivityChartData[]>([]);
  const activities = useAppSelector(getActivities);
  const selectedYear = useAppSelector(getSelectedYear);

  useEffect(() => {
    const thisYear = new Date().getFullYear();
    if (activities.length > 0 && (!selectedYear || selectedYear === thisYear)) {
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const current = activities.filter((activity) => {
        return selectedCategory
          ? activity.date.toDate().getMonth() === thisMonth &&
              activity.date.toDate().getFullYear() === thisYear &&
              activity.category === selectedCategory.category
          : activity.date.toDate().getMonth() === thisMonth &&
              activity.date.toDate().getFullYear() === thisYear;
      });
      let lastMonth = thisMonth - 1;
      let lastYear = thisYear;
      if (thisMonth === 0) {
        lastMonth = 11;
        lastYear--;
      }
      const previous = activities.filter((activity) => {
        return selectedCategory
          ? activity.date.toDate().getMonth() === lastMonth &&
              activity.date.toDate().getFullYear() === lastYear &&
              activity.category === selectedCategory.category
          : activity.date.toDate().getMonth() === lastMonth &&
              activity.date.toDate().getFullYear() === lastYear;
      });

      let _data = [];
      let previousDurations = 0;
      let currentDurations = 0;

      let currIdx = 0;
      let prevIdx = 0;
      const currentDate = new Date().getDate();
      for (let i = 0; i <= 31; i++) {
        // sum of same day activities
        if (current && current[currIdx]?.date.toDate().getDate() === i) {
          do {
            currentDurations += current[currIdx].duration;
            currIdx++;
          } while (current && current[currIdx]?.date.toDate().getDate() === i);
        }
        if (previous && previous[prevIdx]?.date.toDate().getDate() === i) {
          do {
            previousDurations += previous[prevIdx].duration;
            prevIdx++;
          } while (previous[prevIdx]?.date.toDate().getDate() === i);
        }
        if (current && currentDate >= i) {
          _data.push({
            name: i.toString(),
            previous: previousDurations,
            current: currentDurations,
          } as ActivityChartData);
        } else {
          _data.push({
            name: i.toString(),
            previous: previousDurations,
          } as ActivityChartData);
        }
      }

      setData(_data);
    }
  }, [activities, selectedCategory, selectedYear]);

  return (
    <ResponsiveContainer height={322}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='colorPrevious' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='5%' stopColor='#808080' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#808080' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='colorCurrent' x1='0' y1='0' x2='1' y2='1'>
            <stop
              offset='5%'
              stopColor={colors[selectedCategory ? selectedCategory.color : 0]}
              stopOpacity={0.8}
            />
            <stop
              offset='95%'
              stopColor={colors[selectedCategory ? selectedCategory.color : 0]}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey='name' />
        <YAxis tickFormatter={numFormatter} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type='monotone'
          dataKey='previous'
          stroke='#808080'
          fillOpacity={1}
          fill='url(#colorPrevious)'
          strokeWidth={2}
        />
        <Area
          type='monotone'
          dataKey='current'
          stroke={colors[selectedCategory ? selectedCategory.color : 0]}
          fillOpacity={1}
          fill='url(#colorCurrent)'
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default MonthlyActivityChart;
