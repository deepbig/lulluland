import React, { useEffect, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { chipColors as colors } from 'lib/index';
import { useAppSelector } from 'hooks';
import { getAssetSummaries, getTotalIncomeExpense } from 'modules/asset';
import { AssetTypes } from 'types';
import { pieChartActiveShape } from 'components/custom/CustomPieChart';

interface AssetPieChartType {
  name: string;
  value: number;
}

/**
 * 자산 pie chart (자산, 순자산 filter, 자산 타입별 filter)
 * ex) 자산 pie chart (cash, Fixed Income (bond/fixed deposits), real assets, Equities)
 * edit 버튼 추가해서 값 수정 가능하도록 하기
 * @returns
 */
function AssetPieChart() {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [data, setData] = useState<Array<AssetPieChartType>>([]);
  const totalIncomeExpense = useAppSelector(getTotalIncomeExpense);

  useEffect(() => {
    if (assetSummaries.length > 0) {
      const _assetSummary = assetSummaries[assetSummaries.length - 1];
      setData([
        {
          name: AssetTypes.CASH,
          value:
            _assetSummary.assets[AssetTypes.CASH] +
            totalIncomeExpense[0] -
            totalIncomeExpense[1],
        },
        {
          name: AssetTypes.FIXED_INCOME,
          value: _assetSummary.assets[AssetTypes.FIXED_INCOME],
        },
        {
          name: AssetTypes.REAL_ASSET,
          value: _assetSummary.assets[AssetTypes.REAL_ASSET],
        },
        {
          name: AssetTypes.EQUITY,
          value: _assetSummary.assets[AssetTypes.EQUITY],
        },
      ]);
    }
  }, [assetSummaries, totalIncomeExpense]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
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
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default AssetPieChart;