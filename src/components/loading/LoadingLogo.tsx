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
    <div className='full-screen'>
      <div className='dim-screen'>
        <img src='/Lulluland.png' alt='Logo' className='center' />
      </div>
    </div>
  ) : null;
}

export default LoadingLogo;
