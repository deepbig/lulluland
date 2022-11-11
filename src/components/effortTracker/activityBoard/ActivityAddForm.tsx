import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
} from '@mui/material';
import { saveActivity, fetchAllActivitySummaries } from 'db/repositories/activity';
import { useAppDispatch, useAppSelector } from 'hooks';
import { currentDateTime } from 'lib';
import {
  getActivities,
  getSelectedYear,
  setActivityList,
  setActivitySummaryList,
} from 'modules/activity';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import { ActivityAddFormData, ActivityData } from 'types';

interface ActivityAddFormProps {
  open: boolean;
  handleClose: () => void;
  selectedCategory: string;
}

function ActivityAddForm(props: ActivityAddFormProps) {
  const user = useAppSelector(getUser);
  const activities = useAppSelector(getActivities);
  const selectedYear = useAppSelector(getSelectedYear);
  const [values, setValues] = useState<ActivityAddFormData>({
    category: props.selectedCategory,
    date: currentDateTime(),
    note: '',
    duration: 0,
    uid: '',
  });
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      if (user) {
        dispatch(setBackdrop(true));

        const addValues = {
          ...values,
          uid: user.uid,
        };

        const newActivity: ActivityData | null = await saveActivity(addValues);
        let updatedActivities = [...activities];

        if (newActivity) {
          let end = selectedYear
            ? new Date(selectedYear + 1, 0, 1)
            : new Date();
          let start = selectedYear
            ? new Date(selectedYear, 0, 1)
            : new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
          if (
            (selectedYear &&
              newActivity.date.toDate().getFullYear() !== selectedYear) ||
            (!selectedYear &&
              (newActivity.date.toDate() < start ||
                newActivity.date.toDate() > end))
          ) {
            // ignore if the activity is out of selected range.
          } else if (activities.length === 0) {
            dispatch(setActivityList([newActivity]));
          } else {
            const newActivityDate = newActivity.date.toDate().getTime();
            if (
              updatedActivities[0].date.toDate().getTime() > newActivityDate
            ) {
              updatedActivities.splice(0, 0, newActivity);
            } else {
              // find right location from backward.
              for (let i = updatedActivities.length - 1; i >= 0; i--) {
                if (
                  updatedActivities[i].date.toDate().getTime() <=
                  newActivityDate
                ) {
                  updatedActivities.splice(i + 1, 0, newActivity);
                  break;
                }
              }
            }
            dispatch(setActivityList(updatedActivities));
          }
          try {
            const _activitiesSummaries = await fetchAllActivitySummaries(
              user.uid
            );
            dispatch(setActivitySummaryList(_activitiesSummaries));
            dispatch(
              setSnackbar({
                open: true,
                message: 'New Activity data saved successfully!',
                severity: 'success',
              })
            );
          } catch (e) {
            dispatch(
              setSnackbar({
                open: true,
                severity: 'error',
                message: `Failed to fetch activity summaries due to an error: ${e}`,
              })
            );
          }
        } else {
          dispatch(
            setSnackbar({
              open: true,
              message: 'Something went wrong, please try again later.',
              severity: 'error',
            })
          );
        }
        props.handleClose();
      }
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          message: `Creating Activity was not successful due to database error: ${e}`,
          severity: 'error',
        })
      );
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.id]: e.target.value,
    });
  };

  const handleSelect = (event: SelectChangeEvent) => {
    setValues({ ...values, category: event.target.value });
  };

  const maxDateTime = currentDateTime();

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Activity Add Form
        </DialogTitle>
        <DialogContent>
          <form
            id='activity-add-form'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl variant='standard' sx={{ mb: 1 }} fullWidth>
              <InputLabel id='category-selection-label'>Category</InputLabel>
              <Select
                labelId='category-selection-label'
                label='Category'
                value={values.category}
                onChange={handleSelect}
              >
                {user?.categories?.map((category, i) => (
                  <MenuItem key={i} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              required
              id='date'
              label='Date & Time'
              type='datetime-local'
              fullWidth
              variant='standard'
              defaultValue={maxDateTime}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin='dense'
              id='note'
              label='Note'
              fullWidth
              multiline
              maxRows={5}
              variant='standard'
              onChange={handleChange}
            />
            <TextField
              required
              margin='dense'
              id='duration'
              label='Duration (mins)'
              type='number'
              fullWidth
              variant='standard'
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button type='submit' form='activity-add-form' variant='contained'>
            Add
          </Button>
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ActivityAddForm;
