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
  Fade,
  Box,
  Fab,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import UserMenu from './UserMenu';
import { useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import MenuListItems from './MenuListItems';
import { drawerWidth } from 'lib';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ScrollTop = (props: { children: React.ReactElement }) => {
  const { children } = props;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role='presentation'
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
};

export default function NavBar(props: { selectedName: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(getUser);
  const theme = useTheme();
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => {
    setOpen(!open);
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
      <ScrollTop>
        <Fab size='small' aria-label='scroll back to top'>
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
