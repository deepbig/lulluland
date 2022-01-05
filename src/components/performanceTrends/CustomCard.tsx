import { forwardRef } from 'react';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 },
};

const CustomCard = forwardRef((props: any, ref) => {
  const { children, title, ...others } = props;
  return (
    <Card
      ref={ref}
      {...others}
      sx={{
        border: 'none',
        ':hover': {
          boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)',
        },
      }}
    >
      {/* card header and action */}
      {title && <CardHeader sx={headerSX} title={title} />}
      {/* content & header divider */}
      {title && <Divider />}
      {/* card content */}
      <CardContent style={{ padding: 16 }}>{children}</CardContent>
    </Card>
  );
});

export default CustomCard;
