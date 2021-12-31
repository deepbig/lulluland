import { useEffect, useState } from 'react';
import { Grid, Typography, Avatar, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PerformanceChart from 'components/performanceChart/PerformanceChart';
import CustomCard from './CustomCard';
import { styled } from '@mui/material/styles';
import { blue, purple, teal, orange, brown } from '@mui/material/colors';
import { PerformanceData, PerformanceChartData } from 'types/types';
import * as performance from 'db/repositories/performance';
import * as category from 'db/repositories/category';

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

// This will be used after firestore api created.
const colorList = [
  {
    bgColor: blue[500],
    baColor: blue[800],
    avColor: blue[200],
  },
  {
    bgColor: purple[500],
    baColor: purple[800],
    avColor: purple[200],
  },
  {
    bgColor: teal[500],
    baColor: teal[800],
    avColor: teal[200],
  },
  {
    bgColor: orange[500],
    baColor: orange[800],
    avColor: orange[200],
  },
  {
    bgColor: brown[500],
    baColor: brown[800],
    avColor: brown[200],
  },
];

function PerformanceTrends() {
  const [subcategories, setSubcategories] = useState<Array<string>>([]);
  const [performances, setPerformances] = useState<Array<PerformanceData[]>>(
    []
  );

  useEffect(() => {
    fetchSubcategories('Workout');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (subcategories && subcategories.length > 0) {
      fetchPerformances(subcategories);
    }
  }, [subcategories]);

  const fetchSubcategories = async (_category: string) => {
    const _subcategories = await category.selectedSubcategories(_category);
    if (JSON.stringify(subcategories) !== JSON.stringify(_subcategories)) {
      setSubcategories(_subcategories);
    }
  };

  const fetchPerformances = async (subcategory: string[]) => {
    const _performances = await performance.selectedCurrentFive(subcategory);
    setPerformances(_performances);
  };

  const createChartData = (performances: PerformanceData[]) => {
    let chartData: PerformanceChartData[] = [];
    performances?.forEach((data) =>
      chartData.unshift({
        time: data.date?.toDate().toDateString(),
        count: data.values,
      })
    );
    return chartData;
  };

  return (
    <>
      <Grid container direction='row' spacing={2}>
        {/* need loop start */}
        {performances?.map((performance, index) =>
          performance.length > 1 ? (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <CardWrapper
                bgColor={colorList[index % 5]?.bgColor}
                baColor={colorList[index % 5]?.baColor}
              >
                <Grid container alignItems='center'>
                  <Grid item xs={6}>
                    <Grid container alignItems='center'>
                      <Grid item xs={12}>
                        <Typography component='h3' variant='h6'>
                          💪{performance[0]?.subcategory}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: '2rem',
                            fontWeight: 500,
                            mr: 1,
                          }}
                        >
                          {performance[0]?.values} reps
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
                          {(
                            (performance[0]?.values /
                              performance[performance.length - 1]?.values -
                              1) *
                            100
                          ).toFixed(1)}
                          %
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            backgroundColor: colorList[index % 5]?.avColor,
                            color: colorList[index % 5]?.bgColor,
                          }}
                        >
                          <ArrowForwardIcon
                            fontSize='inherit'
                            sx={{
                              transform: `rotate(${
                                performance[0]?.values >
                                performance[performance.length - 1]?.values
                                  ? '-45deg'
                                  : '45deg'
                              })`,
                            }}
                          />
                        </Avatar>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>
                          from{' '}
                          {performance[performance.length - 1].date
                            ?.toDate()
                            .toDateString()}
                        </Typography>
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
                      <PerformanceChart data={createChartData(performance)} />
                    </Box>
                  </Grid>
                </Grid>
              </CardWrapper>
            </Grid>
          ) : null
        )}
      </Grid>
    </>
  );
}

export default PerformanceTrends;
