import { months, numFormatter } from 'lib';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { green, red } from '@mui/material/colors';
import { useAppSelector } from 'hooks';
import { getAssetSummaries } from 'modules/asset';
import { IncomeExpensesData } from 'types';
import CustomTooltip from 'components/custom/CustomTooltip';

interface MonthlyTrendDataType {
  name: string;
  expense: number;
  income: number;
}

const sumOfIncomeExpenses = (data: IncomeExpensesData[]) => {
  if (!data) {
    return 0;
  }

  let sum = 0;
  for (const amt of data) {
    sum += amt.amount;
  }
  return sum;
};

/**
 * 월별 소비 최솟값(소비 타입 별 filter) / 평균 그래프 (6개월) (bar chart)
 * bar chart (income, expense) for recent 6 months.
 * @returns
 */
function MonthlyTrend() {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [data, setData] = useState<Array<MonthlyTrendDataType>>([]);

  useEffect(() => {
    if (assetSummaries.length > 0) {
      const len = assetSummaries.length - 1;
      const _data = [];
      for (let i = len; i > len - 6 && assetSummaries[i]; i--) {
        _data.unshift({
          name: months[assetSummaries[i]?.date.toDate().getMonth()],
          income: sumOfIncomeExpenses(assetSummaries[i].incomes),
          expense: sumOfIncomeExpenses(assetSummaries[i].expenses),
        });
      }
      setData(_data);
    }
  }, [assetSummaries]);

  return (
    <ResponsiveContainer height={300}>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
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
        <Bar
          dataKey='expense'
          fill={red[500]}
          label={{ fill: red[500], position: 'top', formatter: numFormatter }}
        />
        <Bar
          dataKey='income'
          fill={green[500]}
          label={{ fill: green[500], position: 'top', formatter: numFormatter }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyTrend;
