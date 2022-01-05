import { useEffect, useState } from 'react';
import { useAppSelector } from 'hooks';
import { getPerformances } from 'modules/performance';

function LoadingLogo() {
  const [start, setStart] = useState(true);
  const performances = useAppSelector(getPerformances);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStart(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return start === true || performances?.length === 0 ? (
    <div className='full-screen'>
      <div className='dim-screen'>
        <img src='/Lulluland.png' alt='Logo' className='center' />
      </div>
    </div>
  ) : null;
}

export default LoadingLogo;
