import { Grid, Typography, Avatar, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PerformanceChart from 'components/performanceChart/PerformanceChart';
import CustomCard from './CustomCard';
import { styled } from '@mui/material/styles';
import { blue, purple, teal } from '@mui/material/colors';

const CardWrapper = styled(CustomCard, {
  shouldForwardProp: (prop) => prop !== 'bgColor' && prop !== 'baColor',
})<{ bgColor: string; baColor: string }>(({ theme, bgColor, baColor }) => ({
  backgroundColor: bgColor,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5,
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: baColor,
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140,
    },
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: baColor,
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70,
    },
  },
}));

// // This will be used after firestore api created.
// const colorList = [
//   {
//     bgColor: blue[500],
//     baColor: blue[800],
//   },
//   {
//     bgColor: purple[500],
//     baColor: purple[800],
//   },
//   {
//     bgColor: teal[500],
//     baColor: teal[800],
//   },
//   {
//     bgColor: orange[500],
//     baColor: orange[800],
//   },
//   {
//     bgColor: brown[500],
//     baColor: brown[800],
//   },
// ];

function PerformanceTrends() {
  return (
    <>
      <Grid container direction='row' spacing={2}>
        {/* need loop start */}
        <Grid item xs={12} md={6} lg={4}>
          <CardWrapper bgColor={blue[500]} baColor={blue[800]}>
            <Grid container alignItems='center'>
              <Grid item xs={6}>
                <Grid container alignItems='center'>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '2.125rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 0.75,
                        mb: 0.75,
                      }}
                    >
                      12 reps
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 0.75,
                        mb: 0.75,
                      }}
                    >
                      10%
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: blue[200],
                        color: blue[500],
                      }}
                    >
                      <ArrowForwardIcon
                        fontSize='inherit'
                        sx={{ transform: 'rotate(-45deg)' }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>from the previous record.</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    height: 150,
                  }}
                >
                  <PerformanceChart />
                </Box>
              </Grid>
            </Grid>
          </CardWrapper>
        </Grid>
        {/* need loop end */}
        <Grid item xs={12} md={6} lg={4}>
          <CardWrapper bgColor={purple[500]} baColor={purple[800]}>
            <Grid container alignItems='center'>
              <Grid item xs={6}>
                <Grid container alignItems='center'>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '2.125rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 0.75,
                        mb: 0.75,
                      }}
                    >
                      12 reps
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 0.75,
                        mb: 0.75,
                      }}
                    >
                      10%
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: purple[200],
                        color: purple[500],
                      }}
                    >
                      <ArrowForwardIcon
                        fontSize='inherit'
                        sx={{ transform: 'rotate(-45deg)' }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>from the previous record.</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    height: 150,
                  }}
                >
                  <PerformanceChart />
                </Box>
              </Grid>
            </Grid>
          </CardWrapper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CardWrapper bgColor={teal[500]} baColor={teal[800]}>
            <Grid container alignItems='center'>
              <Grid item xs={6}>
                <Grid container alignItems='center'>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '2.125rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 0.75,
                        mb: 0.75,
                      }}
                    >
                      12 reps
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 0.75,
                        mb: 0.75,
                      }}
                    >
                      10%
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: teal[200],
                        color: teal[500],
                      }}
                    >
                      <ArrowForwardIcon
                        fontSize='inherit'
                        sx={{ transform: 'rotate(-45deg)' }}
                      />
                    </Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>from the previous record.</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    height: 150,
                  }}
                >
                  <PerformanceChart />
                </Box>
              </Grid>
            </Grid>
          </CardWrapper>
        </Grid>
      </Grid>
    </>
  );
}

export default PerformanceTrends;
