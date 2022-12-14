import { pieChartActiveShape } from 'components/custom/CustomPieChart';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { IncomeExpenseDetailData } from 'types';
import { pieChartColors as colors } from 'lib';

interface MonthlyDetailPieChartData {
  name: string;
  value: number;
}

interface MonthlyDetailPieChartProps {
  details: IncomeExpenseDetailData[];
}

function MonthlyDetailPieChart({ details }: MonthlyDetailPieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<MonthlyDetailPieChartData[]>([]);

  useEffect(() => {
    const _data = [];
    let index = 0;
    for (const detail of details) {
      if (index < 6) {
        _data.push({
          name: detail.category,
          value: detail.amount,
        });
      } else if (index === 6) {
        _data.push({
          name: 'Etc.',
          value: detail.amount,
        });
      } else {
        _data[6].value += detail.amount;
      }
    }
    setData(_data);
  }, [details]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  return (
    <ResponsiveContainer height={250}>
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
  );
}

export default MonthlyDetailPieChart;
