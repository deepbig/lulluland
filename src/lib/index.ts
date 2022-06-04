import { blue, purple, teal, orange, brown } from '@mui/material/colors';

export const isFound = (value: string, arr: string[]) => {
    const left = value.toLowerCase();
    return arr?.some((right) => left === right.toLowerCase());
  };

export const barColors = [blue[500], purple[500], teal[500], orange[500], brown[500]];

export const chipColors = [blue[400], purple[400], teal[400], orange[400], brown[400]];

export const currentDateTime = () => {
  const dateObj = new Date();
  return `${dateObj.getFullYear()}-${dateObj.getMonth() < 9 ? '0' : ''}${dateObj.getMonth() + 1
      }-${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}T${dateObj.getHours() < 10 ? '0' : ''}${dateObj.getHours()
      }:${dateObj.getMinutes() < 10 ? '0' : ''}${dateObj.getMinutes()}`;
};
