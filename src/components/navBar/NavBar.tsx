import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  IconButton,
  Divider,
  Typography,
  Toolbar,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import UserMenu from './UserMenu';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import MenuListItems from './MenuListItems';
import { drawerWidth } from 'lib';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    // whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(0),
      },
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7.5),
      },
    }),
  },
}));

export default function NavBar(props: { selectedName: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const [start, setStart] = useState(true);
  const theme = useTheme();
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const timer = setTimeout(() => {
      setStart(false);
    }, 2500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return start !== true ? (
    <>
      <AppBar position='absolute' open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {isSmallWidth && open ? '' : props.selectedName}
          </Typography>

          {user ? (
            <UserMenu />
          ) : (
            <Button
              variant='outlined'
              color='inherit'
              onClick={() => navigate(`/signin`)}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {isSmallWidth ? (
        <MuiDrawer open={open} onClose={toggleDrawer}>
        <Toolbar />
        <MenuListItems
          open={open}
          username={user?.username ? user.username : 'deepbig'}
          handleClose={toggleDrawer}
        />
      </MuiDrawer>
      ) : (
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <MenuListItems
            open={open}
            username={user?.username ? user.username : 'deepbig'}
            handleClose={() => setOpen(false)}
          />
        </Drawer>
      )}
    </>
  ) : null;
}
