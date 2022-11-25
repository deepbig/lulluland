import React, { useState } from 'react';
import {
  ListSubheader,
  ListItemText,
  ListItem,
  Divider,
  Typography,
  Popover,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import ListItemIcon from '@mui/material/ListItemIcon';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SavingsIcon from '@mui/icons-material/Savings';
import BookIcon from '@mui/icons-material/Book';
import WebIcon from '@mui/icons-material/Web';
import InfoIcon from '@mui/icons-material/Info';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import NavCard from '../custom/NavCard';
import { useNavigate } from 'react-router-dom';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -16,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

type MenuListItemsProps = {
  open: boolean;
  handleClose: () => void;
  username: string;
};

function MenuListItems(props: MenuListItemsProps) {
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
      <ListItem
        button
        onClick={() => {
          navigate(`/dashboard/${props.username}/effort-tracker`);
          props.handleClose();
        }}
      >
        <ListItemIcon>
          <Badge badgeContent={'✨'}>
            <TrackChangesIcon />
          </Badge>
        </ListItemIcon>
        <StyledBadge badgeContent={'new'} color='secondary'>
          <ListItemText primary='Effort Tracker' />
        </StyledBadge>
      </ListItem>
      <ListItem
        button
        onClick={() => {
          navigate(`/dashboard/${props.username}/asset-tracker`);
          props.handleClose();
        }}
      >
        <ListItemIcon>
          <Badge badgeContent={'💵'}>
            <SavingsIcon />
          </Badge>
        </ListItemIcon>
        <StyledBadge badgeContent={'beta'} color='secondary'>
          <ListItemText primary='Asset Tracker' />
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

      {props.open ? (
        <NavCard title='Welcome to Lulluland!' bgColor={orange[400]}>
          <Typography variant='body2'>
            Lulluland is a tracker app for <b>calcuating your daily efforts</b>{' '}
            and <b>evaluating your improvements</b>. <br />{' '}
          </Typography>
        </NavCard>
      ) : (
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
            <NavCard title='Welcome to Lulluland!' bgColor={orange[400]}>
              <Typography variant='body2'>
                Lulluland is a tracker app for{' '}
                <b>calcuating your daily efforts</b> and{' '}
                <b>evaluating your improvements</b>. <br />{' '}
              </Typography>
            </NavCard>
          </Popover>
        </ListItem>
      )}
    </div>
  );
}

export default MenuListItems;