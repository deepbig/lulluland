import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Drawer,
  IconButton,
  Typography,
  Toolbar,
  Button,
  useTheme,
  useMediaQuery,
  Box,
  Fab,
  useScrollTrigger,
  Zoom,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from './UserMenu';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import MenuListItems from './MenuListItems';
import { drawerWidth } from 'lib';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function NavBar(props: { selectedName: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const theme = useTheme();
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('md'));
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  return (
    <>
      <AppBar
        position='fixed'
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: 'none' } }}
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
      {/* small screen drawer */}
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant='temporary'
          open={open}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <Toolbar />
          <MenuListItems
            open={open}
            username={user?.username ? user.username : 'deepbig'}
            handleClose={toggleDrawer}
          />
        </Drawer>
        {/* large screen drawer */}
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <Toolbar />
          <MenuListItems
            open={true}
            username={user?.username ? user.username : 'deepbig'}
            handleClose={() => setOpen(false)}
          />
        </Drawer>
      </Box>
      <Zoom
        in={trigger}
        timeout={transitionDuration}
        style={{
          transitionDelay: `${trigger ? transitionDuration.exit : 0}ms`,
        }}
        unmountOnExit
      >
        <Fab
          size='small'
          aria-label='scroll back to top'
          onClick={() => {
            window.scrollTo(0, 0);
          }}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Zoom>
    </>
  );
}
