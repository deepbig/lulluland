import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getActivities,
  setActivityList,
  setActivitySummaryList,
} from 'modules/activity';
import React, { useEffect, useState } from 'react';
import { ActivityData, CategoryData, UserData } from 'types';
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
import { chipColors as colors } from 'lib';

interface SummaryProps {
  selectedCategory: CategoryData | null;
  selectedUser: UserData | null;
}

function RecentActivity({ selectedCategory, selectedUser }: SummaryProps) {
  const theme = useTheme();
  const activities = useAppSelector(getActivities);
  const user = useAppSelector(getUser);
  const [data, setData] = useState<ActivityData[]>([]);
  const [index, setIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activities.length > 0) {
      if (!selectedCategory) {
        setData([...activities]);
        setIndex(activities.length - 1);
      } else {
        // when selectedCategory changed, reset index
        const newData = activities.filter(
          (activity) => activity.category === selectedCategory.category
        );
        setData(newData);
        setIndex(newData.length - 1);
      }
    } else {
      setData([]);
      setIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, selectedCategory]);

  const handleDelete = async (index: number) => {
    if (data[index] && user) {
      dispatch(setBackdrop(true));
      try {
        await remove(user.uid, data[index]);
        dispatch(
          setSnackbar({
            open: true,
            severity: 'success',
            message: 'Selected activity is successfully deleted.',
          })
        );
        let newActivities = activities.filter(
          (activity) => activity.id !== data[index].id
        );
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
      dispatch(setBackdrop(false));
    } else {
      dispatch(
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Invalid activity deletion request.',
        })
      );
    }
    setConfirm(false);
  };

  const findColor = (category: string) => {
    const index = selectedUser?.categories.find(
      (c) => c.category === category
    )?.color;
    if (index) {
      return colors[index];
    } else {
      return theme.palette.primary.dark;
    }
  };

  return (
    <>
      {data[index] ? (
        <Card sx={{ backgroundColor: findColor(data[index].category) }}>
          <CardHeader
            action={
              selectedUser && user?.username === selectedUser.username ? (
                <IconButton
                  aria-label='delete'
                  onClick={() => setConfirm(true)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null
            }
            title={data[index].date.toDate().toLocaleString()}
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
              category: {data[index].category}
            </Typography>
            <Typography variant='body1' gutterBottom>
              Duration: {data[index].duration} mins
            </Typography>
            <Box
              sx={{
                display: 'flex',
                overflow: 'hidden',
                overflowY: 'auto',
              }}
            >
              <Typography variant='body1' gutterBottom>
                Note: {data[index].note}
              </Typography>
            </Box>
          </CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
            <Button
              color='inherit'
              disabled={index === 0}
              onClick={() => setIndex(index - 1)}
            >
              <ArrowBackIosIcon fontSize='small' />
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              color='inherit'
              disabled={index === data.length - 1}
              onClick={() => setIndex(index + 1)}
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
          <Button onClick={() => handleDelete(index)}>Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RecentActivity;
