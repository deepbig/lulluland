import React, { useEffect } from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Backdrop,
  CircularProgress,
  CssBaseline,
  Snackbar,
  useMediaQuery,
} from '@mui/material';
import { Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getBackdrop, setBackdrop, reset as resetBackdrop } from 'modules/backdrop';
import { reset as resetActivity } from 'modules/activity';
import { reset as resetPerformance } from 'modules/performance';
import { reset as resetSnackbar, setOpen } from 'modules/snackbar';
import { checkRedirectResult, onAuthChange } from 'db/repositories/auth';
import { setUser, reset as resetUser } from 'modules/user';
import { getLoggedInUser } from 'db/repositories/user';
import DashboardPage from 'pages/DashboardPage';
import SignInPage from 'pages/SignInPage';
import SignUpPage from 'pages/SignUpPage';
import NotFoundPage from 'pages/NotFoundPage';
import InitialPage from 'pages/InitialPage';
import LoadingLogo from 'components/loading/LoadingLogo';
import { getSnackbar } from 'modules/snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const dispatch = useAppDispatch();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const backdrop = useAppSelector(getBackdrop);
  const snackbar = useAppSelector(getSnackbar);
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
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 2000,
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
              navigate(`/dashboard/${loggedInUser.username}/effort-tracker`);
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
        dispatch(resetSnackbar());
        
      }
      dispatch(setBackdrop(false));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSnackbarClose = () => {
    dispatch(setOpen(false));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingLogo />
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/dashboard/:username' element={<DashboardPage />} />
        <Route path='/dashboard/:username/:type' element={<DashboardPage />} />
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
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%'}}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
