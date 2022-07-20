import { useAppDispatch, useAppSelector } from 'hooks';
import { getActivities, setActivityList } from 'modules/activity';
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
import { remove } from 'db/repositories/activity';
import { setBackdrop } from 'modules/backdrop';
import { getUser } from 'modules/user';

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
  const [confirm, setConfirm] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activities.length > 0) {
      if (!props.category) {
        setSelectedActivity(activities[activities.length - 1]);
      } else {
        for (let i = activities.length - 1; i >= 0; i--) {
          if (activities[i].category === props.category) {
            setSelectedActivity(activities[i]);
            return;
          }
        }
        setSelectedActivity(null);
      }
    } else {
      setSelectedActivity(null);
    }
  }, [activities, props.category]);

  const handleDelete = async () => {
    if (selectedActivity && user) {
      dispatch(setBackdrop(true));
      try {
        await remove(user.uid, selectedActivity.id);
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
      } catch (error) {
        dispatch(
          setSnackbar({
            open: true,
            severity: 'error',
            message: `Failed to delete selected activity due to error: ${error}`,
          })
        );
      }
    }
    dispatch(setBackdrop(false));
    setConfirm(false);
  };

  // Recent Activity
  // 1. category (secondary)
  // 2. DateTime (primary: title) (본인 것이면, edit & delete)
  // 3. Duration (secondary)
  // 4. Note (primary: body)

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
          <CardContent sx={{ paddingTop: 0 }}>
            <Typography variant='body1'>
              category: {selectedActivity.category}
            </Typography>
            <Typography variant='body1'>
              Duration: {selectedActivity.duration} mins
            </Typography>
            <Typography variant='body1'>
              Note: {selectedActivity.note}
            </Typography>
          </CardContent>
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
