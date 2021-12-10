import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

/*
 * this custom theme currently is not being used.
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19657b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
