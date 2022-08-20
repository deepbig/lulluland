import { Card, CardContent, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { months, numFormatter, numWithCommas } from 'lib';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { green, red } from '@mui/material/colors';
import { useAppSelector } from 'hooks';
import { getAssetSummaries } from 'modules/asset';
import { IncomeExpensesData } from 'types';

interface MonthlyTrendDataType {
  name: string;
  expense: number;
  income: number;
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
                {payload.name}: ₩ {numWithCommas(payload.value as number)}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
};

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
