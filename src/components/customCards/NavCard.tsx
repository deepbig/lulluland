// material-ui
import { styled } from '@mui/material/styles';
import { Card, CardContent, Grid, Typography } from '@mui/material';

// styles
const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.warning.light,
  marginTop: '16px',
  marginBottom: '16px',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '200px',
    height: '200px',
    border: '19px solid ',
    borderColor: theme.palette.warning.main,
    borderRadius: '50%',
    top: '65px',
    right: '-150px',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: '200px',
    height: '200px',
    border: '3px solid ',
    borderColor: theme.palette.warning.main,
    borderRadius: '50%',
    top: '145px',
    right: '-70px',
  },
}));

// ==============================|| PROFILE MENU - UPGRADE PLAN CARD ||============================== //

const NavCard = () => (
  <CardStyle>
    <CardContent>
      <Grid container direction='column' spacing={2}>
        <Grid item>
          <Typography variant='h4'>Welcome to Lulluland!</Typography>
        </Grid>
        <Grid item>
          <Typography
            variant='subtitle1'
            color='grey.900'
            sx={{ opacity: 0.7 }}
          >
            Lulluland is a tracker app for <br />
            <b>calcuating your daily efforts</b> <br />
            and <b>evaluating your improvements</b>. <br />
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </CardStyle>
);

export default NavCard;
