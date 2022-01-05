import React, { useState } from 'react';
import { useAppSelector } from 'hooks';
import { getActivities } from 'modules/activity';
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Avatar,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import { ActivityData } from 'types/types';

function YearlySummary() {
  const activities = useAppSelector(getActivities);
  const [totalPractices, setTotalPractices] = useState<number>(0);
  const [totalDurations, setTotalDurations] = useState<number>(0);
  const [bestPractice, setBestPractice] = useState<ActivityData | null>(null);
  const countPractices = () => {
    let practices = 0;
    let index = null;
    let values: number = 0;
    activities.forEach((activity, idx) => {
      if (activity.values > 0) {
        practices++;
        if (!values || activity.values > values) {
          index = idx;
          values = activity.values;
        }
      }
    });
    if (practices > 0) {
      setTotalPractices(practices);
      if (index) {
        setBestPractice(activities[index]);
      }
    }
    return practices;
  };
  const countDurations = () => {
    let durations = 0;
    activities.forEach((activity) => {
      if (activity.values > 0) {
        durations += activity.values;
      }
    });
    if (durations > 0) {
      setTotalDurations(durations);
    }
    return durations;
  };
  return (
    <Grid container direction='row' spacing={2}>
      <Grid item xs={12}>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FitnessCenterIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                totalPractices
                  ? `${totalPractices} days`
                  : `${countPractices()} days`
              }
              secondary='Total Practices in the Last Year'
            />
          </ListItem>
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
                  : `${countDurations()} mins`
              }
              secondary='Total Practice Durations in the Last Year'
            />
          </ListItem>
          {bestPractice ? (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <StarIcon />
                </Avatar>
              </ListItemAvatar>
              <Tooltip title={bestPractice.note}>
                <ListItemText
                  primary={
                    bestPractice.values +
                    ' mins (' +
                    bestPractice.date.toDate().toDateString() +
                    ')'
                  }
                  secondary='Best Practice in the Last Year'
                />
              </Tooltip>
            </ListItem>
          ) : null}
        </List>
      </Grid>
    </Grid>
  );
}

export default YearlySummary;
