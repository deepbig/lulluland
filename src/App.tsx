import React, { useEffect } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Backdrop,
  CircularProgress,
  CssBaseline,
  useMediaQuery,
} from '@mui/material';
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import DashboardPage from 'pages/DashboardPage';
// import LoadingLogo from 'components/loading/LoadingLogo';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getBackdrop, setBackdrop, reset as resetBackdrop } from 'modules/backdrop';
import { reset as resetActivity } from 'modules/activity';
import { reset as resetPerformance } from 'modules/performance';
import { checkRedirectResult, onAuthChange } from 'db/repositories/auth';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import { setUser, reset as resetUser } from 'modules/user';
import { getLoggedInUser } from 'db/repositories/user';
import NotFoundPage from 'pages/NotFoundPage';
import InitialPage from 'pages/InitialPage';
import LoadingLogo from 'components/loading/LoadingLogo';

function App() {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const backdrop = useAppSelector(getBackdrop);
  const navigate = useNavigate();

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
        textTransform: 'none',
      },
    },
  });

  useEffect(() => {
    onAuthChange(async (user: any) => {
      dispatch(setBackdrop(true));
      if (user) {
        const loggedInUser = await getLoggedInUser(user);
        if (loggedInUser) {
          dispatch(setUser(loggedInUser));
          const result = await checkRedirectResult();
          if (result) {
            if (loggedInUser.username) {
              navigate(`/dashboard/${loggedInUser.username}`);
            } else {
              navigate('/initial');
            }
          }
        } else {
          alert('Failed to fetch user from database. Please login again.');
        }
      } else {
        // user logged out
        dispatch(resetActivity());
        dispatch(resetBackdrop());
        dispatch(resetUser());
        dispatch(resetPerformance());
        
      }
      dispatch(setBackdrop(false));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingLogo />
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/dashboard/:username' element={<DashboardPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/initial' element={<InitialPage />} />
        <Route path='/404' element={<NotFoundPage />} />
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
