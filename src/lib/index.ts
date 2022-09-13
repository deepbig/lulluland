import { blue, purple, teal, orange, brown } from '@mui/material/colors';

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const isFound = (value: string, arr: string[]) => {
  const left = value.toLowerCase();
  return arr?.some((right) => left === right.toLowerCase());
};

export const backgroundColors = [
  blue[500],
  purple[500],
  teal[500],
  orange[500],
  brown[500],
];
export const circleColors = [
  blue[800],
  purple[800],
  teal[800],
  orange[800],
  brown[800],
];
export const avatarColors = [
  blue[200],
  purple[200],
  teal[200],
  orange[200],
  brown[200],
];
export const chipColors = [
  blue[400],
  purple[400],
  teal[400],
  orange[400],
  brown[400],
];

export const currentDateTime = () => {
  const dateObj = new Date();
  return `${dateObj.getFullYear()}-${dateObj.getMonth() < 9 ? '0' : ''}${
    dateObj.getMonth() + 1
  }-${dateObj.getDate() < 10 ? '0' : ''}${dateObj.getDate()}T${
    dateObj.getHours() < 10 ? '0' : ''
  }${dateObj.getHours()}:${
    dateObj.getMinutes() < 10 ? '0' : ''
  }${dateObj.getMinutes()}`;
};

export const givenDateFormat = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = (1 + dateObj.getMonth()).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  return `${month}/${day}/${year}`;
};

export const givenMonthYearFormat = (date: string) => {
  const dateObj = date ? new Date(date) : new Date();
  const year = dateObj.getFullYear();
  const month = (1 + dateObj.getMonth()).toString().padStart(2, '0');
  return `${month}/${year}`;
};

export const numFormatter = (num: number) => {
  // return len > 3 ? `${value / 1000}${units[len/3]}` : value;
  if (num >= 1000000000) {
    return parseFloat((num / 1000000000).toFixed(2)) + ' B';
  }
  if (num >= 1000000) {
    return parseFloat((num / 1000000).toFixed(2)) + ' M';
  }
  if (num >= 1000) {
    return parseFloat((num / 1000).toFixed(2)) + ' K';
  }
  return num.toString();
};

export const numFormatterWoDecimal = (num: number) => {
  // return len > 3 ? `${value / 1000}${units[len/3]}` : value;
  if (num >= 1000000000) {
    return parseInt((num / 1000000000).toFixed(0)) + ' B';
  }
  if (num >= 1000000) {
    return parseInt((num / 1000000).toFixed(0)) + ' M';
  }
  if (num >= 1000) {
    return parseInt((num / 1000).toFixed(0)) + ' K';
  }
  return num.toString();
};

export const numWithCommas = (num: number|string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}