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
} from '@mui/material';
import OAuth from './OAuth';
import { useNavigate } from 'react-router-dom';


function SignIn() {
  const navigate = useNavigate();

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ padding: 4 }}>
        <Box display='flex' justifyContent='space-between' pb={3}>
          <Typography color='textPrimary' variant='h5'>
            Sign In
          </Typography>
          <Link component='button' onClick={() => navigate(`/signup`)}>I don't have an account</Link>
        </Box>
        <Grid container justifyContent='center' spacing={2}>
          <Grid item xs={12}>
            <TextField
              label='Email'
              size='small'
              name='email'
              variant='outlined'
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant='contained'>
              Continues
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent='center'>
              <Link component='button' onClick={() => console.log('test')}>
                Can't sign in?
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <OAuth />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default SignIn;
