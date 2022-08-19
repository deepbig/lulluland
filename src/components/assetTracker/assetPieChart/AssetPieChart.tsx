import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell } from 'recharts';
import { chipColors as colors, numFormatter } from 'lib/index';
import { useAppSelector } from 'hooks';
import { getAssetSummaries, getTotalIncomeExpense } from 'modules/asset';
import { AssetTypes } from 'types';

interface AssetPieChartType {
  name: string;
  value: number;
}

const renderActiveShape = (props: any) => {
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
      >
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={5} textAnchor='middle' fill='#FFF'>
        {'₩ ' + numFormatter(payload.value)}
      </text>
      <text x={cx} y={cy} dy={25} textAnchor='middle' fill='#999'>
        {`(Rate ${(percent * 100).toFixed(0)}%)`}
      </text>
    </g>
  );
};

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
          activeShape={renderActiveShape}
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