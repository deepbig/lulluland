import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  ListSubheader,
  ListItemText,
  ListItem,
  Divider,
  Badge,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BookIcon from '@mui/icons-material/Book';
import WebIcon from '@mui/icons-material/Web';
import InfoIcon from '@mui/icons-material/Info';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -16,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function MenuListItems(props: any) {
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
