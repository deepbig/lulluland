import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getActivities,
  getSelectedYear,
  setActivityList,
  setSelectedYear,
} from 'modules/activity';
import {
  Grid,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tooltip,
  Avatar,
  Button,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import { ActivityData } from 'types';
import * as activity from 'db/repositories/activity';
import { fetchAllActivitySummaries } from 'db/repositories/activitySummary';
import {
  getActivitySummaries,
  setActivitySummaryList,
} from 'modules/activitySummary';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';

interface SummaryProps {
  category: string;
  uid: string;
}

function YearlySummary(props: SummaryProps) {
  const activities = useAppSelector(getActivities);
  const activitySummaries = useAppSelector(getActivitySummaries);
  const selectedYear = useAppSelector(getSelectedYear);
  const [totalPractices, setTotalPractices] = useState<number>(0);
  const [totalDurations, setTotalDurations] = useState<number>(0);
  const [bestPractice, setBestPractice] = useState<ActivityData | null>(null);
  const [minRangeYear, setMinRangeYear] = useState<number[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let minYear = new Date().getFullYear();
    for (const data of activitySummaries) {
      if (props.category === '' || props.category === data.category) {
        if (data.yearly[data.yearly.length - 1].year < minYear) {
          minYear = data.yearly[data.yearly.length - 1].year;
        }
      }
    }
    const currentYear = new Date().getFullYear();
    const range = [];
    for (let i = currentYear; i >= minYear; i--) {
      range.push(i);
    }
    setMinRangeYear(range);
  }, [activitySummaries, props.category]);

  useEffect(() => {
    countPractices();
    countDurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, selectedYear, props.category]);

  useEffect(() => {
    if (props.uid) {
      fetchActivities(selectedYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, props.uid]);

  useEffect(() => {
    if (props.uid) {
      fetchActivitySummaries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.uid]);

  const fetchActivities = async (selectedYear: number) => {
    try {
      dispatch(setBackdrop(true));
      const _activities = selectedYear
        ? await activity.selected(selectedYear, props.uid)
        : await activity.current(props.uid);
      dispatch(setActivityList(_activities));
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to fetch activity data from db. Error: ' + e,
        })
      );
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  const calculateMonthlySummary = () => {
    const list = [];
    let durations = 0;
    let counts = 0;
    let bestPractice = 0;
    let month = 0;
    for (const data of activities) {
      if (data.date.toDate().getMonth() > month) {
        list.push({ month, durations, counts, bestPractice });
        while (month !== data.date.toDate().getMonth() && month < 13) {
          month++;
        }
        durations = data.duration;
        counts = 1;
        bestPractice = data.duration;
      } else {
        durations += data.duration;
        counts++;
        if (data.duration > bestPractice) {
          bestPractice = data.duration;
        }
      }
    }
    list.push({ month, durations, counts, bestPractice });
    console.log(list);
  };

  const fetchActivitySummaries = async () => {
    const _activitiesSummaries = await fetchAllActivitySummaries(props.uid);
    dispatch(setActivitySummaryList(_activitiesSummaries));
  };

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

  const handleYearChange = (value: number) => {
    dispatch(setSelectedYear(value));
  };

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item xs={12} sm={4}>
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
      <Grid item xs={12} sm={4}>
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
      <Grid item xs={12} sm={4}>
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

      <Grid item xs={12}>
        <Grid container direction='row' spacing={1}>
          <Grid item>
            <Button
              value='Current'
              onClick={() => handleYearChange(0)}
              variant={selectedYear === 0 ? 'contained' : 'text'}
            >
              Current
            </Button>
          </Grid>
          {minRangeYear.map((year) => (
            <Grid item key={year}>
              <Button
                value={year}
                onClick={() => handleYearChange(year)}
                variant={selectedYear === year ? 'contained' : 'text'}
              >
                {year}
              </Button>
            </Grid>
          ))}
          {calculateMonthlySummary()}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default YearlySummary;
