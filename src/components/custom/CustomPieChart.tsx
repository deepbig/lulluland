import React from 'react';
import { numFormatter } from 'lib';
import { Sector } from 'recharts';

export const pieChartActiveShape = (props: any) => {
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
        style={{
          textShadow:
            '-1px 0 #121212, 0 1px #121212, 1px 0 #121212, 0 -1px #121212',
        }}
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
