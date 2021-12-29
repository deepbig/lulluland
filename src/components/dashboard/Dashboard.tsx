import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Tooltip,
  ListSubheader,
  ListItemText,
  ListItem,
  Paper,
  Grid,
  Container,
  IconButton,
  Divider,
  Typography,
  Toolbar,
  Box,
  Avatar,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItemIcon from '@mui/material/ListItemIcon';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BookIcon from '@mui/icons-material/Book';
import WebIcon from '@mui/icons-material/Web';
import InfoIcon from '@mui/icons-material/Info';
import EffortTracker from 'components/effortTracker/EffortTracker';
import Title from 'components/title/Title';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PerformanceTrends from 'components/performanceTrends/PerformanceTrends';

function Copyright(props: any) {
  return (
    <Typography
      variant='body2'
      color='GrayText.secondary'
      align='center'
      {...props}
    >
      {'Copyright © Hongsuk Ryu ' + new Date().getFullYear() + '.'}
    </Typography>
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -16,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

function MenuListItems(props: any) {
  let navigate = useNavigate();
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
      <ListItem button>
        <ListItemIcon>
          <InfoIcon />
        </ListItemIcon>
        <ListItemText primary='About' />
      </ListItem>
    </div>
  );
}

function DashboardContent() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
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
            <Tooltip title='Hongsuk Ryu'>
              <IconButton sx={{ p: 0 }}>
                <Avatar alt='Hongsuk Ryu' src='/profile_img.jpg' />
              </IconButton>
            </Tooltip>
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
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Effort Tracker */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Title>Workout Tracker</Title>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      overflow: 'hidden',
                    }}
                  >
                    {/* TODO - year selection: current, 2022, 2021 */}
                    <EffortTracker />
                  </Box>
                </Paper>
              </Grid>
              {/* Performance Chart */}
              <Grid item xs={12} sm={6} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <PerformanceTrends />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  {/* <Deposits /> */}
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
