import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getActivities,
  setActivityList,
  setActivitySummaryList,
} from 'modules/activity';
import React, { useEffect, useState } from 'react';
import { ActivityData } from 'types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { setSnackbar } from 'modules/snackbar';
import { fetchAllActivitySummaries, remove } from 'db/repositories/activity';
import { setBackdrop } from 'modules/backdrop';
import { getUser } from 'modules/user';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface SummaryProps {
  category: string;
  username: string | undefined;
}

function RecentActivity(props: SummaryProps) {
  const theme = useTheme();
  const activities = useAppSelector(getActivities);
  const user = useAppSelector(getUser);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(
    null
  );
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [confirm, setConfirm] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activities.length > 0) {
      if (!props.category) {
        if (selectedCategory) {
          setSelectedCategory('');
        }
        setSelectedActivity(activities[activities.length - 1 - index]);
      } else {
        if (props.category !== selectedCategory) {
          setSelectedCategory(props.category);
          setIndex(0);
        }
        let count = index;
        for (let i = activities.length - 1; i >= 0; i--) {
          if (activities[i].category === props.category && count-- === 0) {
            setSelectedActivity(activities[i]);
            return;
          }
        }
        setSelectedActivity(null);
      }
    } else {
      setSelectedActivity(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, props.category, index]);

  const handleDelete = async () => {
    if (selectedActivity && user) {
      dispatch(setBackdrop(true));
      try {
        await remove(user.uid, selectedActivity);
        dispatch(
          setSnackbar({
            open: true,
            severity: 'success',
            message: 'Selected activity is successfully deleted.',
          })
        );
        let newActivities = [...activities];
        newActivities.pop();
        dispatch(setActivityList(newActivities));
        setIndex(0);
        try {
          const _activitiesSummaries = await fetchAllActivitySummaries(
            user.uid
          );
          dispatch(setActivitySummaryList(_activitiesSummaries));
        } catch (e) {
          dispatch(
            setSnackbar({
              open: true,
              severity: 'error',
              message: `Failed to fetch activity summaries due to an error: ${e}`,
            })
          );
        }
      } catch (error) {
        dispatch(
          setSnackbar({
            open: true,
            severity: 'error',
            message: `Failed to delete selected activity due to an error: ${error}`,
          })
        );
      }
    }
    dispatch(setBackdrop(false));
    setConfirm(false);
  };

  return (
    <>
      {selectedActivity ? (
        <Card sx={{ backgroundColor: theme.palette.primary.dark }}>
          <CardHeader
            action={
              props.username && user?.username === props.username ? (
                <IconButton
                  aria-label='delete'
                  onClick={() => setConfirm(true)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null
            }
            title={selectedActivity.date.toDate().toLocaleString()}
          />
          <CardContent
            sx={{
              paddingTop: 0,
              height: 150,
              [theme.breakpoints.up('lg')]: {
                height: 200,
              },
              overflow: 'hidden',
              overflowY: 'auto',
            }}
          >
            <Typography variant='body1' gutterBottom>
              category: {selectedActivity.category}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Duration: {selectedActivity.duration} mins
            </Typography>
            <Box sx={{
              display: 'flex',
              overflow: 'hidden',
              overflowY: 'auto',
            }}>
            <Typography variant='body1' gutterBottom>
              Note: {selectedActivity.note}
            </Typography>
              </Box>
          </CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
            <Button
              color='inherit'
              disabled={index === activities.length - 1}
              onClick={() => setIndex(index + 1)}
            >
              <ArrowBackIosIcon fontSize='small' />
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              color='inherit'
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              Next <ArrowForwardIosIcon fontSize='small' />
            </Button>
          </Box>
        </Card>
      ) : (
        <Box m='auto'>
          <Typography variant='guideline' align='center'>
            There are no recent Activity. Please add one!
          </Typography>
        </Box>
      )}
      <Dialog open={confirm}>
        <DialogContent>Are you sure to delete this activity?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RecentActivity;
