import React, { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';

// styles
const CardStyle = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor: string }>(({ theme, bgColor }) => ({
  width: 230,
  background: bgColor,
  marginTop: '16px',
  marginBottom: '16px',
  marginLeft: '5px',
  // overflow: 'hidden',
  position: 'relative',
}));

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //

const NavCard = forwardRef((props: any, ref) => {
  const { children, title, bgColor } = props;
  return (
    <CardStyle bgColor={bgColor}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        {children}
      </CardContent>
    </CardStyle>
  );
});
NavCard.displayName = "NavCard";

export default NavCard;
