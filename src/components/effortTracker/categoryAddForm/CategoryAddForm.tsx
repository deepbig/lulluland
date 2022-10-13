import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { updateCategories } from 'db/repositories/user';
import { useAppDispatch, useAppSelector } from 'hooks';
import { isFound } from 'lib';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';
import { getUser, setUser } from 'modules/user';
import React, { useEffect, useState } from 'react';

interface CategoryAddFormProps {
  open: boolean;
  handleClose: () => void;
}

interface CategoryAddFormState {
  category: string;
  categories: string[];
}

function CategoryAddForm(props: CategoryAddFormProps) {
  const [values, setValues] = useState<CategoryAddFormState>({
    category: '',
    categories: [],
  });
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);

  useEffect(() => {
    if (user?.categories) {
      setValues({ ...values, categories: user.categories });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, category: event.target.value });
  };

  const handleAddCategory = () => {
    if (isFound(values.category, values.categories)) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Category already exists.',
          severity: 'error',
        })
      );
    } else {
      const categories = [...values.categories];
      categories.push(values.category);
      setValues({ ...values, categories: categories, category: '' });
    }
  };

  const handleDeleteCategory = (value: string) => {
    if (!isFound(value, values.categories)) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Category does not exist.',
          severity: 'error',
        })
      );
    } else {
      const categories = values.categories.filter(
        (category) => category !== value
      );
      setValues({ ...values, categories: categories });
    }
  };

  const handleSave = async () => {
    if (values.categories.length === 0) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'You need to add at least one category.',
          severity: 'error',
        })
      );
      return;
    }
    // 1. Update user categories
    if (user) {
      dispatch(setBackdrop(true));
      try {
        await updateCategories(user.uid, values.categories);
        dispatch(setUser({ ...user, categories: values.categories }));
        window.location.reload();
      } catch (e) {
        setSnackbar({
          open: true,
          message: 'Failed to update categories. Error: ' + e,
          severity: 'error',
        });
      } finally {
        props.handleClose();
        dispatch(setBackdrop(false));
      }
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle sx={{ textAlign: 'center' }}>Category Add Form</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <Grid container justifyContent='center' spacing={1}>
            <Grid item xs={12}>
              <TextField
                label='Category'
                size='small'
                name='category'
                variant='outlined'
                value={values.category}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                variant='contained'
                fullWidth
                onClick={handleAddCategory}
                disabled={values.category ? false : true}
              >
                Add this category
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <Paper
                variant='outlined'
                component='ul'
                elevation={0}
                sx={{
                  backgroundColor: 'inherit',
                  display: 'flex',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  padding: 1,
                }}
              >
                {values.categories.length > 0 ? (
                  values.categories.map((category, i) => (
                    <li key={i}>
                      <Chip
                        label={category}
                        sx={{ margin: 0.5 }}
                        onDelete={() => {
                          handleDeleteCategory(category);
                        }}
                        color='primary'
                      />
                    </li>
                  ))
                ) : (
                  <Typography variant='guideline' align='center'>
                    Please add a category to display list.
                  </Typography>
                )}
                {/* </Paper> */}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={values.categories.length === 0}
        >
          Save
        </Button>
        <Button variant='contained' onClick={props.handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryAddForm;
