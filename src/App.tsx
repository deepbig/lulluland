import React from 'react';
import './App.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { Navigate, Routes, Route } from 'react-router-dom';
import DashboardPage from 'pages/DashboardPage';
import BlogPage from 'pages/BlogPage';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/blog' element={<BlogPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
