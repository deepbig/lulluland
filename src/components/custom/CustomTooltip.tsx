import { Card, CardContent, Divider, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { numWithCommas } from 'lib';
import React from 'react';
import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

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

export default CustomTooltip;
