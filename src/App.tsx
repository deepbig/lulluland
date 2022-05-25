import React, { useEffect } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Backdrop,
  CircularProgress,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import { Navigate, Routes, Route } from 'react-router-dom';
import DashboardPage from 'pages/DashboardPage';
import LoadingLogo from 'components/loading/LoadingLogo';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getBackdrop } from 'modules/backdrop';
import { onAuthChange } from 'db/repositories/auth';
import { reset as resetBackdrop } from 'modules/backdrop';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';

function App() {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const backdrop = useAppSelector(getBackdrop);

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'dark',
    },
    typography: {
      guideline: {
        color: 'gray',
        display: 'block',
      },
      button: {
        textTransform: 'none'
      }
    },
  });

  useEffect(() => {
    onAuthChange(async (user: any) => {
      if (user) {
        // user logged in
      } else {
        // user logged out
        dispatch(resetBackdrop());
      }
    });
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingLogo />
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={backdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
