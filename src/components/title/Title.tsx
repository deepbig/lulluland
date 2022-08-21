import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';

interface TitleProps {
  children?: React.ReactNode;
  buttonFunction?: () => void;
}

export default function Title(props: TitleProps) {
  return (
    <Box display='flex' justifyContent='space-between'>
      <Typography component='h2' variant='h6' gutterBottom>
        {props.children}
      </Typography>
      {props.buttonFunction && (
        <Button onClick={props.buttonFunction} variant='contained'>
          NEW
        </Button>
      )}
    </Box>
  );
}
