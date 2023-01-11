import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import {
  setCategoryList,
  getPerformances,
  setPerformanceList,
  getPerformanceChartData,
  setPerformanceChartData,
} from 'modules/performance';
import { Grid, Typography, Avatar, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PerformanceChart from 'components/effortTracker/performanceChart/PerformanceChart';
import MainCard from 'components/custom/MainCard';
import { styled } from '@mui/material/styles';
import {
  PerformanceData,
  UserData,
  CategoryData,
  PerformanceCategoryData,
} from 'types';
import { backgroundColors, circleColors, avatarColors } from 'lib';
import { getUser } from 'modules/user';
import { fetchAllPerformances } from 'db/repositories/performance';
import { setSnackbar } from 'modules/snackbar';

const CardWrapper = styled(MainCard, {
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

export interface PerformanceTrendsProps {
  selectedCategory: CategoryData | null;
  selectedUser: UserData | null;
  username: string | undefined;
}

function PerformanceTrends({
  selectedCategory,
  selectedUser,
  username,
}: PerformanceTrendsProps) {
  const performances = useAppSelector(getPerformances);
  const performanceChartData = useAppSelector(getPerformanceChartData);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let unsubscribe;
    if (selectedUser && selectedUser.categories.length > 0) {
      const performanceChartData: Array<any> = [];
      const newCategories: Array<PerformanceCategoryData> = [];

      const categories = selectedUser.categories;
      if (categories) {
        categories.forEach((category) => {
          newCategories.push({
            category: category.category,
            subcategories: [],
          });
          performanceChartData.push([]);
        });

        let category = '';
        let index = -1;
        let subcategory = '';
        // subIndex needed to be switch to findIndex
        let subIndex = -1;

        performances.forEach((performance) => {
          // if category switched, add new array.
          if (category !== performance.category) {
            category = performance.category;
            index = categories.findIndex((c) => c.category === category);
            subIndex = -1;
          }

          // if subcategory switched, add new array on the category array.
          if (subcategory !== performance.subcategory || subIndex === -1) {
            subcategory = performance.subcategory;
            subIndex++;
            newCategories[index].subcategories.push(subcategory);
            performanceChartData[index].push([]);
          }
          performanceChartData[index][subIndex].push({
            ...performance,
            date: performance.date?.toDate().toDateString(),
          } as PerformanceData);
        });
        dispatch(setPerformanceChartData(performanceChartData));
        dispatch(setCategoryList(newCategories));
      }
    } else {
      dispatch(setPerformanceChartData([]));
      dispatch(setCategoryList([]));
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performances]);

  useEffect(() => {
    if (selectedUser?.uid) {
      fetchAndSetAllPerformances(selectedUser.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  // 처음 렌더링 시 호출. performance가 변경된 경우 위의 값 호출
  const fetchAndSetAllPerformances = async (uid: string) => {
    try {
      const _performances = await fetchAllPerformances(uid);
      dispatch(setPerformanceList(_performances));
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to fecth performances from db. Error: ' + e,
        })
      );
    }
  };

  return (
    <>
      {performanceChartData.length < 1 ? (
        <Box m={2}>
          <Typography variant='guideline' align='center' mt={1}>
            {user && user.username === username
              ? "You don't have any performance history. Please add an indicator for your record!"
              : 'There is no performance history.'}
          </Typography>
        </Box>
      ) : (
        <Box m={1}></Box>
      )}
      <Grid container direction='row' spacing={2}>
        {performanceChartData?.map((performance) =>
          performance?.map((subPerformance, index) =>
            !selectedCategory ||
            selectedCategory.category === subPerformance[0]?.category ? (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                xl={3}
                key={subPerformance[0]?.subcategory + index}
              >
                <CardWrapper
                  bgColor={backgroundColors[index % backgroundColors.length]}
                  baColor={circleColors[index % circleColors.length]}
                >
                  <Grid container alignItems='center'>
                    <Grid item xs={6}>
                      <Grid container alignItems='center'>
                        <Grid item xs={12}>
                          <Typography component='h3' variant='h6'>
                            💪
                            {
                              subPerformance[subPerformance.length - 1]
                                ?.subcategory
                            }
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
                            {
                              subPerformance[subPerformance.length - 1]
                                ?.performance
                            }{' '}
                            reps
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
                              (subPerformance[subPerformance.length - 1]
                                ?.performance /
                                subPerformance[0]?.performance -
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
                              backgroundColor:
                                avatarColors[index % avatarColors.length],
                              color:
                                backgroundColors[
                                  index % backgroundColors.length
                                ],
                            }}
                          >
                            <ArrowForwardIcon
                              fontSize='inherit'
                              sx={{
                                transform: `rotate(${
                                  subPerformance[subPerformance.length - 1]
                                    ?.performance >
                                  subPerformance[0]?.performance
                                    ? '-45deg'
                                    : '45deg'
                                })`,
                              }}
                            />
                          </Avatar>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            from {subPerformance[0]?.date}
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
                        <PerformanceChart data={subPerformance} />
                      </Box>
                    </Grid>
                  </Grid>
                </CardWrapper>
              </Grid>
            ) : null
          )
        )}
      </Grid>
    </>
  );
}

export default PerformanceTrends;
