import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  ListSubheader,
  ListItemText,
  ListItem,
  Badge,
  IconButton,
  Divider,
  Typography,
  Toolbar,
  Avatar,
  Popover,
  Paper,
  Box,
  Stack,
  CardContent,
  Card,
  Grid,
  Switch,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BookIcon from '@mui/icons-material/Book';
import WebIcon from '@mui/icons-material/Web';
import InfoIcon from '@mui/icons-material/Info';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NavCard from '../customCards/NavCard';
import MainCard from '../customCards/MainCard';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -16,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

function MenuListItems(props: any) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <ListItem button onClick={() => navigate(`/dashboard`)}>
        <ListItemIcon>
          <Badge badgeContent={'✨'}>
            <TrackChangesIcon />
          </Badge>
        </ListItemIcon>
        <StyledBadge badgeContent={'new'} color='secondary'>
          <ListItemText primary='Effort Tracker' />
        </StyledBadge>
      </ListItem>
      <Divider />
      <ListSubheader component='div' id='nav-subheader'>
        {props.open ? 'External Links' : '\xa0'}
      </ListSubheader>

      <ListItem
        button
        onClick={() => window.open('https://roolog.notion.site', '_blank')}
      >
        <ListItemIcon>
          <BookIcon />
        </ListItemIcon>
        <StyledBadge badgeContent={'blog'} color='secondary'>
          <ListItemText primary='Roolog' />
        </StyledBadge>
      </ListItem>
      <ListItem
        button
        onClick={() =>
          window.open('https://deepbig.github.io/portfolio/', '_blank')
        }
      >
        <ListItemIcon>
          <WebIcon />
        </ListItemIcon>
        <StyledBadge badgeContent={'old'} color='secondary'>
          <ListItemText primary='Portfolio' />
        </StyledBadge>
      </ListItem>
      <ListItem
        button
        onClick={() =>
          window.open('https://www.linkedin.com/in/hongsuk/', '_blank')
        }
      >
        <ListItemIcon>
          <LinkedInIcon />
        </ListItemIcon>
        <ListItemText primary='LinkedIn' />
      </ListItem>
      <ListItem
        button
        onClick={() => window.open('https://github.com/deepbig', '_blank')}
      >
        <ListItemIcon>
          <GitHubIcon />
        </ListItemIcon>
        <ListItemText primary='GitHub' />
      </ListItem>
      <ListItem
        aria-owns={open ? 'mouse-over-popover-info' : undefined}
        aria-haspopup='true'
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary='About' />
        <Popover
          id='mouse-over-popover-info'
          sx={{ pointerEvents: 'none' }}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <Paper>
            <NavCard />
          </Paper>
        </Popover>
      </ListItem>
    </div>
  );
}

const drawerWidth: number = 240;

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
    whiteSpace: 'nowrap',
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

export default function NavBar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStart(true);
    }, 2400);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleClickProfile = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const openProfile = Boolean(anchorEl);
  const id = open ? 'popover-profile' : undefined;

  return start ? (
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
            Effort Tracker
          </Typography>

          <IconButton
            sx={{ p: 0 }}
            aria-describedby={id}
            onClick={handleClickProfile}
          >
            <Avatar alt='Hongsuk Ryu' src='/profile_img.jpg' />
          </IconButton>
          <Popover
            id={id}
            open={openProfile}
            anchorEl={anchorEl}
            onClose={handleCloseProfile}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Paper>
              <MainCard>
                <Box>
                  <Stack>
                    <Stack direction='row' spacing={0.5} alignItems='center'>
                      <Typography variant='h5'>Hongsuk Ryu</Typography>
                    </Stack>
                    <Typography variant='subtitle2'>
                      Full-Stack Web Developer
                    </Typography>
                  </Stack>

                  <Card
                    sx={{ backgroundColor: theme.palette.primary.dark, my: 2 }}
                  >
                    <CardContent>
                      <Grid container spacing={3} direction='column'>
                        <Grid item>
                          <Grid
                            item
                            container
                            alignItems='center'
                            justifyContent='space-between'
                          >
                            <Grid item>
                              <Typography variant='subtitle1'>
                                Theme Mode
                              </Typography>
                            </Grid>
                            <Grid item>
                              {/* need to create switch component */}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
              </MainCard>
            </Paper>
          </Popover>
        </Toolbar>
      </AppBar>
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
        <MenuListItems open={open} />
      </Drawer>
    </>
  ) : null;
}
