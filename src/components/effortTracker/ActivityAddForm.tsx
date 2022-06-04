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
import { saveActivity } from 'db/repositories/activity';
import { useAppDispatch, useAppSelector } from 'hooks';
import { currentDateTime } from 'lib';
import { getActivities, setActivityList } from 'modules/activity';
import { setBackdrop } from 'modules/backdrop';
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
          if (activities.length === 0) {
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
        } else {
          alert(
            'Failed to save activity due to database error. Please try again.'
          );
        }
        props.handleClose();
      }
    } catch (e) {
      alert('Creating Activity was not successful due to database error: ' + e);
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
