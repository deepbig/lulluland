import { useAppSelector } from 'hooks';
import { numFormatter } from 'lib';
import { getAssetSummaries } from 'modules/asset';
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from 'recharts';
import CustomTooltip from 'components/custom/CustomTooltip';

interface ExpenseLineChartType {
  name: string;
  previous: number;
  current?: number;
}

function MonthlyExpenseLineChart() {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [data, setData] = useState<Array<ExpenseLineChartType>>([]);

  useEffect(() => {
    // 1 - 31까지 배열 만들고 각각의 날짜에 대한 데이터를 넣어준다.
    // 이번 달 데이터는 오늘 날짜 이후에 대한 데이터는 비워둔다.
    // index는 가장 최근의 데이터의 date을 값을 입력한다.
    if (assetSummaries.length > 0) {
      let _data = [];
      let previousExpense = 0;
      let currentExpense = 0;
      const previous = assetSummaries[assetSummaries.length - 2]?.expenses;
      const current = assetSummaries[assetSummaries.length - 1]?.expenses;
      const currentDate = new Date().getDate();
      let prevIdx = previous ? previous.length - 1 : -1;
      let currIdx = current ? current.length - 1 : -1;
      for (let i = 1; i <= 31; i++) {
        if (previous && previous[prevIdx]?.date.toDate().getDate() === i) {
          do {
            previousExpense += previous[prevIdx]?.amount;
            prevIdx--;
          } while (previous[prevIdx]?.date.toDate().getDate() === i);
        }
        if (current && current[currIdx]?.date.toDate().getDate() === i) {
          do {
            currentExpense += current[currIdx]?.amount;
            currIdx--;
          } while (current[currIdx]?.date.toDate().getDate() === i);
        }

        if (current && currentDate >= i) {
          _data.push({
            name: i.toString(),
            previous: previousExpense,
            current: currentExpense,
          } as ExpenseLineChartType);
        } else {
          _data.push({
            name: i.toString(),
            previous: previousExpense,
          } as ExpenseLineChartType);
        }
      }

      setData(_data);
    }
  }, [assetSummaries]);

  return (
    <ResponsiveContainer height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='colorPrevious' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='5%' stopColor='#808080' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#808080' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='colorCurrent' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='5%' stopColor='#42a5f5' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#42a5f5' stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey='name' />
        <YAxis tickFormatter={numFormatter} />
        <Tooltip
          content={<CustomTooltip />}
          contentStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)',
            fontSize: 12,
            borderRadius: 10,
          }}
          labelStyle={{ color: 'white' }}
        />
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
          stroke='#42a5f5'
          fillOpacity={1}
          fill='url(#colorCurrent)'
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default MonthlyExpenseLineChart;
