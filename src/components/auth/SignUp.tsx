import { Box, Container, Paper, Typography, Link, Grid, TextField } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  // const [email, setEmail] = useState('');
  // const [emailError, setEmailError] = useState('');

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    // email, password, name
  } 
  

  return (
    <Container maxWidth='sm'>
      <Paper variant='outlined' sx={{ padding: 4 }}>
        <Box display='flex' justifyContent='space-between' pb={3}>
          <Typography color='textPrimary' variant='h5'>
            Sign Up
          </Typography>
          <Link component='button' onClick={() => navigate(`/signin`)}>
            I have an account
          </Link>
        </Box>

        <Grid container justifyContent='center' spacing={2}>
          <Grid item xs={12}>
            <TextField
              label='Email'
              size='small'
              name='email'
              variant='outlined'
              // value={email}
              onChange={handleChangeEmail}
              required
              fullWidth
              // error={emailError ? true : false}
              // helperText={emailError}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default SignUp;
