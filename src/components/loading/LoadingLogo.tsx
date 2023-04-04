import React from 'react';
import { Backdrop } from '@mui/material';
import { useEffect, useState } from 'react';

function LoadingLogo() {
  const [start, setStart] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStart(false);
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return start === true ? (
    <Backdrop
      sx={{
        backgroundColor: '#212121',
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
      open={start}
    >
      <div className='dim-screen'>
        <img src='/Lulluland.png' alt='Logo' className='center' />
      </div>
    </Backdrop>
  ) : null;
}

export default LoadingLogo;
