import React, { useEffect, useState } from 'react';
import { useAppSelector } from 'hooks';
import { getActivities } from 'modules/activity';
import {
  Grid,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Avatar,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import { ActivityData } from 'types';

interface SummaryProps {
  category: string;
}

function YearlySummary(props: SummaryProps) {
  const activities = useAppSelector(getActivities);
  const [totalPractices, setTotalPractices] = useState<number>(0);
  const [totalDurations, setTotalDurations] = useState<number>(0);
  const [bestPractice, setBestPractice] = useState<ActivityData | null>(null);

  useEffect(() => {
    countPractices();
    countDurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, props.category]);

  const countPractices = () => {
    let practices = 0;
    let index = null;
    let duration: number = 0;
    activities.forEach((activity, idx) => {
      if (
        (!props.category || props.category === activity.category) &&
        activity.duration > 0
      ) {
        practices++;
        if (!duration || activity.duration > duration) {
          index = idx;
          duration = activity.duration;
        }
      }
    });
    setTotalPractices(practices);
    if (index !== null && index >= 0) {
      setBestPractice(activities[index]);
    } else {
      setBestPractice(null);
    }
  };

  const countDurations = () => {
    let durations = 0;
    activities.forEach((activity) => {
      if (
        (!props.category || props.category === activity.category) &&
        activity.duration > 0
      ) {
        durations += activity.duration;
      }
    });
    setTotalDurations(durations);
  };

  return (
    <Grid container direction='row' spacing={3}>
      <Grid item xs={4}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <FitnessCenterIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={totalPractices ? `${totalPractices} days` : `0 days`}
            secondary='Total Practices'
          />
        </ListItem>
      </Grid>
      <Grid item xs={4}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <TimerIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              totalDurations
                ? `${
                    totalDurations >= 60
                      ? (totalDurations / 60).toFixed(1) + ' hours'
                      : totalDurations + ' mins'
                  }`
                : `0 mins`
            }
            secondary='Total Durations'
          />
        </ListItem>
      </Grid>
      <Grid item xs={4}>
        {bestPractice ? (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <StarIcon />
              </Avatar>
            </ListItemAvatar>
            <Tooltip
              title={
                bestPractice.date.toDate().toDateString() +
                '\n Note: ' +
                bestPractice.note
              }
              arrow
            >
              <ListItemText
                primary={bestPractice.duration + ' mins'}
                secondary='Best Practice'
              />
            </Tooltip>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <StarIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={'0 mins'} secondary='Best Practice' />
          </ListItem>
        )}
      </Grid>
    </Grid>
  );
}

export default YearlySummary;
