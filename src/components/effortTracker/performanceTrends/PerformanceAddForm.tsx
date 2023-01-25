import {
  Autocomplete,
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
  IconButton,
  Box,
} from '@mui/material';
import { savePerformance } from 'db/repositories/performance';
import { useAppDispatch, useAppSelector } from 'hooks';
import { currentDateTime } from 'lib';
import { setPerformanceList } from 'modules/performance';
import { setBackdrop } from 'modules/backdrop';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import { CategoryData, PerformanceAddFormData } from 'types';
import { setSnackbar } from 'modules/snackbar';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SubcategoryAddForm from './SubcategoryAddForm';

interface PerformanceAddFormProps {
  open: boolean;
  handleClose: () => void;
  selectedCategory: CategoryData | null;
}

function PerformanceAddForm(props: PerformanceAddFormProps) {
  const user = useAppSelector(getUser);
  const [values, setValues] = useState<PerformanceAddFormData>({
    category: props.selectedCategory ? props.selectedCategory.category : '',
    subcategory: '',
    date: currentDateTime(),
    note: '',
    performance: 0,
    uid: '',
  });
  const [categoryIndex, setCategoryIndex] = useState(0);
  const dispatch = useAppDispatch();
  const [openSubcategoryAddForm, setOpenSubcategoryAddForm] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!user) {
        return;
      }

      dispatch(setBackdrop(true));

      const addValues = {
        ...values,
        uid: user.uid,
      };
      const _performances = await savePerformance(addValues);
      dispatch(setPerformanceList(_performances));

      props.handleClose();
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          severity: 'error',
          message:
            'Creating Performance was not successful due to database error: ' +
            e,
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
    const index = user?.categories?.findIndex(
      (data) => data.category === event.target.value
    );

    if (index !== undefined && index >= 0) {
      setCategoryIndex(index);
      setValues({ ...values, category: event.target.value });
    } else {
      alert('Selected category does not exist in your category list.');
    }
  };

  const maxDateTime = currentDateTime();

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Performance Add Form
        </DialogTitle>
        <DialogContent>
          <form
            id='Performance-add-form'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl variant='standard' sx={{ mb: 1 }} fullWidth required>
              <InputLabel id='category-selection-label'>Category</InputLabel>
              <Select
                labelId='category-selection-label'
                label='Category'
                value={values.category}
                onChange={handleSelect}
              >
                {user?.categories?.map((category, i) => (
                  <MenuItem key={i} value={category.category}>
                    {category.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {values.category ? (
              <>
                <Autocomplete
                  disablePortal
                  id='subcategory-combo-box'
                  onInputChange={(event, subcategory: string) => {
                    setValues({ ...values, subcategory: subcategory });
                  }}
                  options={
                    user?.categories[categoryIndex]?.subcategories
                      ? user.categories[categoryIndex].subcategories.map(
                          (data) => data.name
                        )
                      : []
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Subcategory'
                      disabled={!values.category}
                      variant='standard'
                      fullWidth
                      required
                    />
                  )}
                />
                <Box display='flex' justifyContent='center'>
                  <IconButton onClick={() => setOpenSubcategoryAddForm(true)}>
                    <AddCircleIcon />
                  </IconButton>
                </Box>
              </>
            ) : null}

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
              inputProps={{
                step: 1,
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
              id='performance'
              label='Performance'
              type='number'
              fullWidth
              variant='standard'
              onChange={handleChange}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
          <Button type='submit' form='Performance-add-form' variant='contained'>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {openSubcategoryAddForm && (
        <SubcategoryAddForm
          open={openSubcategoryAddForm}
          handleClose={() => setOpenSubcategoryAddForm(false)}
          selectedCategory={values.category}
        />
      )}
    </>
  );
}

export default PerformanceAddForm;
