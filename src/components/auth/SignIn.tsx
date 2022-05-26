import React, { useState } from 'react';
import { signInWithGoogle } from 'db/repositories/auth';
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
} from '@mui/material';
import OAuth from './OAuth';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate = useNavigate();
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordReset, setPasswordReset] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleEmailSignIn = () => {
    if (!passwordReset) {
      if (!passwordOpen) {
        // check email
        if (!email) {
          setEmailError('Required');
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
          setEmailError('Invalid email address');
        } else {
          setPasswordOpen(true);
        }
      } else {
        // submit sign in form.
      }
    } else {
      // reset password
    }
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
    if (passwordOpen) {
      setPasswordOpen(false);
      setPassword('');
    }
  };

  const handlePasswordReset = () => {
    setPasswordReset(true);
    setEmail('');
    setEmailError('');
    setPassword('');
    setPasswordOpen(false);
  };

  const handleBackToSignIn = () => {
    setEmail('');
    setPasswordReset(false);
    setIsEmailSent(false);
  };

  const handleSendEmail = () => {
    if (!email) {
      setEmailError('Required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      setEmailError('Invalid email address');
    } else {
      setIsEmailSent(true);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ padding: 4 }}>
        <Box display='flex' justifyContent='space-between' pb={3}>
          <Typography color='textPrimary' variant='h5'>
            {!passwordReset ? 'Sign In' : 'Password Reset'}
          </Typography>
          <Link
            component='button'
            onClick={() =>
              !passwordReset ? navigate(`/signup`) : handleBackToSignIn()
            }
          >
            {!passwordReset ? "I don't have an account" : 'Back to sign-in'}
          </Link>
        </Box>

        {passwordReset ? (
          <Typography variant='body1' paddingBottom={2}>
            Enter your email, and we'll send you instructions on how to reset
            your password.
          </Typography>
        ) : null}

        <Grid container justifyContent='center' spacing={2}>
          <Grid item xs={12}>
            {!isEmailSent ? (
              <TextField
                label='Email'
                size='small'
                name='email'
                variant='outlined'
                value={email}
                onChange={handleChangeEmail}
                required
                fullWidth
                error={emailError ? true : false}
                helperText={emailError}
              />
            ) : null}
            {!passwordReset ? (
              <Collapse in={passwordOpen}>
                <TextField
                  label='Password'
                  size='small'
                  name='password'
                  variant='outlined'
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginTop: 1 }}
                />
              </Collapse>
            ) : null}
          </Grid>

          {isEmailSent ? (
            <Grid item xs={12}>
              <Alert severity='success'>
                If there's a Lulluland account connected to this email address,
                we'll email you password reset instructions.<br /> If you don't
                receive the email, please try again and make sure you enter the
                email address associated with your Lulluland account.
              </Alert>
            </Grid>
          ) : null}

          <Grid item xs={12}>
            {!passwordReset ? (
              <Button fullWidth variant='contained' onClick={handleEmailSignIn}>
                {passwordOpen ? 'Sign in' : 'Continues'}
              </Button>
            ) : (
              <Button
                fullWidth
                variant='contained'
                onClick={() =>
                  isEmailSent ? handleBackToSignIn() : handleSendEmail()
                }
              >
                {isEmailSent ? 'Back to sign-in' : 'Send me reset instructions'}
              </Button>
            )}
          </Grid>
          {!passwordReset ? (
            <>
              <Grid item xs={12}>
                <Box display='flex' justifyContent='center'>
                  <Link component='button' onClick={handlePasswordReset}>
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
