import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Link,
  Button,
  TextField,
  Grid,
  Collapse,
  Alert,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import OAuth from './OAuth';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface State {
  email: string;
  emailError: string;
  passwordError: string;
  password: string;
  openPassword: boolean;
  showPassword: boolean;
  resetPassword: boolean;
  isEmailSent: boolean;
}

function SignIn() {
  const navigate = useNavigate();
  const [values, setValues] = useState<State>({
    email: '',
    emailError: '',
    passwordError: '',
    password: '',
    openPassword: false,
    showPassword: false,
    resetPassword: false,
    isEmailSent: false,
  });
  const handleEmailSignIn = () => {
    if (!values.resetPassword) {
      if (!values.openPassword) {
        // check email
        if (!values.email) {
          setValues({ ...values, emailError: 'Required' });
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
          setValues({ ...values, emailError: 'Invalid email address' });
        } else {
          setValues({ ...values, openPassword: true });
        }
      } else {
        if (!values.password) {
          setValues({ ...values, passwordError: 'Required' });
        }
        // submit sign in form.
      }
    } else {
      // reset password
    }
  };

  const handleChange =
    (type: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [type]: event.target.value });
      if (type === 'email') {
        if (values.emailError) {
          setValues({ ...values, emailError: '' });
        }
        if (values.openPassword) {
          setValues({ ...values, openPassword: false, password: '' });
        }
      }
    };

  const handleResetPassword = () => {
    setValues({
      ...values,
      resetPassword: true,
      email: '',
      emailError: '',
      passwordError: '',
      password: '',
      openPassword: false,
    });
  };

  const handleBackToSignIn = () => {
    setValues({
      ...values,
      email: '',
      resetPassword: false,
      isEmailSent: false,
    });
  };

  const handleSendEmail = () => {
    if (!values.email) {
      setValues({ ...values, emailError: 'Required' });
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      setValues({ ...values, emailError: 'Invalid email address' });
    } else {
      setValues({ ...values, isEmailSent: true });
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ padding: 4 }}>
        <Box display='flex' justifyContent='space-between' pb={3}>
          <Typography color='textPrimary' variant='h5'>
            {!values.resetPassword ? 'Sign In' : 'Password Reset'}
          </Typography>
          <Link
            disabled
            component='button'
            onClick={() =>
              !values.resetPassword ? navigate(`/signup`) : handleBackToSignIn()
            }
          >
            {!values.resetPassword
              ? "I don't have an account"
              : 'Back to sign-in'}
          </Link>
        </Box>

        {values.resetPassword ? (
          <Typography variant='body1' paddingBottom={2}>
            Enter your email, and we'll send you instructions on how to reset
            your password.
          </Typography>
        ) : null}

        <Grid container justifyContent='center' spacing={2}>
          <Grid item xs={12}>
            {!values.isEmailSent ? (
              <TextField
                label='Email'
                size='small'
                name='email'
                variant='outlined'
                value={values.email}
                onChange={handleChange('email')}
                required
                fullWidth
                error={values.emailError ? true : false}
                helperText={values.emailError}
              />
            ) : null}
            {!values.resetPassword ? (
              <Collapse in={values.openPassword}>
                <FormControl
                  size='small'
                  required
                  fullWidth
                  variant='outlined'
                  sx={{ marginTop: 1.5 }}
                >
                  <InputLabel htmlFor='Password'>Password</InputLabel>
                  <OutlinedInput
                    id='password'
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          aria-label='toggle password visibility'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge='end'
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label='Password'
                  />
                </FormControl>
              </Collapse>
            ) : null}
          </Grid>

          {values.isEmailSent ? (
            <Grid item xs={12}>
              <Alert severity='success'>
                If there's a Lulluland account connected to this email address,
                we'll email you password reset instructions.
                <br /> If you don't receive the email, please try again and make
                sure you enter the email address associated with your Lulluland
                account.
              </Alert>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            {!values.resetPassword ? (
              <Button
                fullWidth
                variant='contained'
                onClick={handleEmailSignIn}
                disabled
              >
                {values.openPassword ? 'Sign in' : 'Continues'}
              </Button>
            ) : (
              <Button
                fullWidth
                variant='contained'
                onClick={() =>
                  values.isEmailSent ? handleBackToSignIn() : handleSendEmail()
                }
                disabled
              >
                {values.isEmailSent
                  ? 'Back to sign-in'
                  : 'Send me reset instructions'}
              </Button>
            )}
          </Grid>
          {!values.resetPassword ? (
            <>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center'>
                  <Link
                    component='button'
                    onClick={handleResetPassword}
                    disabled
                  >
                    Can't sign in?
                  </Link>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <OAuth />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Paper>
    </Container>
  );
}

export default SignIn;
