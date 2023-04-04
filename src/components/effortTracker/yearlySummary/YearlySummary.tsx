import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getActivities,
  getSelectedYear,
  setActivityList,
  setSelectedYear,
  getActivitySummaries,
  setActivitySummaryList,
} from 'modules/activity';
import { Grid, Avatar, Button, Stack, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import * as activity from 'db/repositories/activity';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';
import { CategoryData } from 'types';
import { getSelectedUser } from 'modules/user';

interface SummaryProps {
  selectedCategory: CategoryData | null;
}

function YearlySummary({ selectedCategory }: SummaryProps) {
  const activities = useAppSelector(getActivities);
  const activitySummaries = useAppSelector(getActivitySummaries);
  const selectedYear = useAppSelector(getSelectedYear);
  const [totalPractices, setTotalPractices] = useState<number>(0);
  const [totalDurations, setTotalDurations] = useState<number>(0);
  const [bestPractice, setBestPractice] = useState<number>(0);
  const [minRangeYear, setMinRangeYear] = useState<number[]>([]);
  const dispatch = useAppDispatch();
  const selectedUser = useAppSelector(getSelectedUser);

  useEffect(() => {
    let minYear = new Date().getFullYear();
    for (const data of activitySummaries) {
      if (!selectedCategory || selectedCategory.category === data.category) {
        if (
          data.yearly?.length > 0 &&
          data.yearly[data.yearly.length - 1].year < minYear
        ) {
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
  }, [activitySummaries, selectedCategory]);

  useEffect(() => {
    countYearlySummary();
  }, [activities, activitySummaries, selectedYear, selectedCategory]);

  useEffect(() => {
    if (selectedUser?.uid) {
      fetchActivities(selectedYear, selectedUser.uid);
    }
  }, [selectedYear, selectedUser]);

  useEffect(() => {
    if (selectedUser?.uid) {
      fetchActivitySummaries(selectedUser.uid);
    }
  }, [selectedUser]);

  const fetchActivities = async (selectedYear: number, uid: string) => {
    try {
      dispatch(setBackdrop(true));
      const _activities = selectedYear
        ? await activity.selected(selectedYear, uid)
        : await activity.current(uid);
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

  const fetchActivitySummaries = async (uid: string) => {
    try {
      dispatch(setBackdrop(true));
      const _activitySummaries = await activity.fetchAllActivitySummaries(uid);
      dispatch(setActivitySummaryList(_activitySummaries));
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to fetch activity summary data from db. Error: ' + e,
        })
      );
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  const countYearlySummary = () => {
    let practices = 0;
    let durations = 0;
    let bestPractice = 0;

    if (selectedYear) {
      activitySummaries.forEach((summary) => {
        if (
          !selectedCategory ||
          selectedCategory.category === summary.category
        ) {
          const data = summary.yearly.find(
            (data) => data.year === selectedYear
          );
          if (data) {
            practices += data.counts;
            durations += data.durations;
            bestPractice += data.bestPractice;
          }
        }
      });
    } else {
      activities.forEach((activity) => {
        if (
          (!selectedCategory ||
            selectedCategory.category === activity.category) &&
          activity.duration > 0
        ) {
          practices++;
          durations += activity.duration;
          if (!bestPractice || activity.duration > bestPractice) {
            bestPractice = activity.duration;
          }
        }
      });
    }

    setTotalPractices(practices);
    setBestPractice(bestPractice);
    setTotalDurations(durations);
  };

  const handleYearChange = (value: number) => {
    dispatch(setSelectedYear(value));
  };

  return (
    <Grid container direction='row' spacing={2}>
      <Grid item xs={12}>
        <Grid
          container
          direction='row'
          spacing={1}
          justifyContent='center'
          alignItems='center'
        >
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
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          <Avatar>
            <EventAvailableIcon />
          </Avatar>
          <Typography>
            {totalPractices ? `${totalPractices} practices` : `0 practices`}
            <Typography variant='guideline'>Total Practices</Typography>
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          <Avatar>
            <TimerIcon />
          </Avatar>
          <Typography>
            {totalDurations
              ? `${
                  totalDurations >= 60
                    ? (totalDurations / 60).toFixed(1) + ' hours'
                    : totalDurations + ' mins'
                }`
              : `0 mins`}
            <Typography variant='guideline'>Total Durations</Typography>
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
          alignItems='center'
        >
          <Avatar>
            <StarIcon />
          </Avatar>
          <Typography>
            {bestPractice ? bestPractice + ' mins' : '0 mins'}
            <Typography variant='guideline'>
              Best Practice&nbsp;&nbsp;&nbsp;
            </Typography>
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default YearlySummary;
