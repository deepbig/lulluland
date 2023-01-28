import {
  Button,
  Chip,
  Container,
  Grid,
  InputAdornment,
  MobileStepper,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState } from 'react';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {
  getUserFromDB,
  updateUserUsernameAndCategories,
} from 'db/repositories/user';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { isCategoryExist, chipColors as colors } from 'lib';
import { auth } from 'db';
import { useAppDispatch } from 'hooks';
import { setBackdrop } from 'modules/backdrop';
import { setUser } from 'modules/user';
import { UserData, CategoryData } from 'types';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    label: 'Enter a username',
    description: 'Find an available username!',
  },
  {
    label: 'Enter a category',
    description: 'Select a category you want to practice!',
  },
];

interface InitialForm {
  username: string;
  usernameError: string;
  category: string;
  categories: CategoryData[];
  isChecked: boolean;
}

function InitialSteps() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = steps.length;
  const currentUser = auth.currentUser;
  const [values, setValues] = useState<InitialForm>({
    username: '',
    usernameError: '',
    category: '',
    categories: [],
    isChecked: false,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // step 1. username
  // step 2. interest

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange =
    (type: keyof InitialForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'username') {
        setValues({
          ...values,
          [type]: event.target.value,
          usernameError: event.target.value.match(/\W/)
            ? 'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
            : '',
          isChecked: false,
        });
      } else {
        setValues({ ...values, [type]: event.target.value });
      }
    };

  const handleUsernameButton = async () => {
    setLoading(true);
    const user = await getUserFromDB(values.username);
    if (user) {
      setValues({
        ...values,
        usernameError: `Username ${values.username} is not available. Please choose another.`,
        isChecked: false,
      });
    } else {
      setValues({ ...values, isChecked: true });
    }
    setLoading(false);
  };

  const handleAddCategory = () => {
    if (isCategoryExist(values.category, values.categories)) {
      alert('You already added the selected category.');
    } else {
      const categories = [...values.categories];
      categories.push({
        category: values.category,
        subcategories: [],
        color: categories.length + 1,
      });
      setValues({ ...values, categories: categories, category: '' });
    }
  };

  const handleDeleteCategory = (value: string) => {
    if (!isCategoryExist(value, values.categories)) {
      alert(
        'Failed to delete selected category, because the category is not on your list.'
      );
    } else {
      const categories = values.categories.filter(
        (category) => category.category !== value
      );
      setValues({ ...values, categories: categories });
    }
  };

  const handleSave = async () => {
    // need to update user db.
    dispatch(setBackdrop(true));
    let user: UserData | null = null;
    if (currentUser) {
      user = await updateUserUsernameAndCategories(
        currentUser.uid,
        values.username,
        values.categories
      );
      if (user) {
        dispatch(setUser(user));
        navigate(`/dashboard/${user.username}/effort-tracker`);
      }
    }

    if (!user) {
      alert('Failed to update user profile. Please try again later.');
    }

    dispatch(setBackdrop(false));
  };

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ padding: 4 }}>
        <Typography color='textPrimary' variant='h5' gutterBottom>
          {steps[activeStep].label}
        </Typography>

        {activeStep === 0 ? (
          <Grid container justifyContent='center' spacing={1}>
            <Grid item xs={12}>
              <TextField
                label='Username'
                size='small'
                name='username'
                variant='outlined'
                value={values.username}
                onChange={handleChange('username')}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      {values.isChecked ? (
                        values.usernameError ? (
                          <ErrorIcon color='error' />
                        ) : (
                          <CheckCircleIcon color='success' />
                        )
                      ) : null}
                    </InputAdornment>
                  ),
                }}
                error={values.usernameError ? true : false}
                helperText={
                  values.usernameError
                    ? values.usernameError
                    : steps[activeStep].description
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                loading={loading}
                variant='contained'
                fullWidth
                onClick={handleUsernameButton}
                disabled={values.username ? false : true}
              >
                Choose this username
              </LoadingButton>
            </Grid>
          </Grid>
        ) : (
          <Grid container justifyContent='center' spacing={1}>
            <Grid item xs={12}>
              <TextField
                label='Category'
                size='small'
                name='category'
                variant='outlined'
                value={values.category}
                onChange={handleChange('category')}
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
              <Paper variant='outlined'>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    margin: 1,
                    padding: 0,
                  }}
                >
                  {values.categories.length > 0 ? (
                    values.categories.map((category, i) => (
                      <Grid key={i} item>
                        <Chip
                          label={category.category}
                          sx={{
                            margin: 0.5,
                            backgroundColor: colors[category.color],
                          }}
                          onDelete={() => {
                            handleDeleteCategory(category.category);
                          }}
                          color='primary'
                        />
                      </Grid>
                    ))
                  ) : (
                    <Typography variant='guideline' align='center'>
                      Please add a category to display list.
                    </Typography>
                  )}
                </Paper>
              </Paper>
            </Grid>
          </Grid>
        )}

        <MobileStepper
          variant='text'
          steps={maxSteps}
          position='static'
          activeStep={activeStep}
          nextButton={
            <Button
              size='small'
              onClick={activeStep === maxSteps - 1 ? handleSave : handleNext}
              disabled={
                !values.isChecked ||
                (activeStep === maxSteps - 1 && values.categories.length < 1)
              }
            >
              {activeStep === maxSteps - 1 ? 'Save' : 'Next'}
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size='small'
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
              Back
            </Button>
          }
        />
      </Paper>
    </Container>
  );
}

export default InitialSteps;
