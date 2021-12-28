import React, { ForwardedRef, forwardRef } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 },
};

interface CustomCardProps {
  boxShadow: boolean;
  children: React.ReactNode;
  darkTitle: boolean;
  secondary: React.ReactNode | string | Object;
  shadow: string;
  title: React.ReactNode | string | Object;
}

const CustomCard = forwardRef((props: CustomCardProps, ref: any) => {
  const {
    boxShadow,
    children,
    darkTitle,
    secondary,
    shadow,
    title,
    ...others
  } = props;
  const border = true;
  const content = true;
  const contentClass = '';
  const contentSX = {};
  const sx = {};

  const theme = useTheme();

  return (
    <Card
      ref={ref}
      {...others}
      sx={{
        border: border ? '1px solid' : 'none',
        // borderColor: theme.palette.primary,
        ':hover': {
          boxShadow: boxShadow
            ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)'
            : 'inherit',
        },
        ...sx,
      }}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader sx={headerSX} title={title} action={secondary} />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={headerSX}
          title={<Typography variant='h3'>{title}</Typography>}
          action={secondary}
        />
      )}

      {/* content & header divider */}
      {title && <Divider />}

      {/* card content */}
      {content && (
        <CardContent sx={contentSX} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
});

export default CustomCard;
