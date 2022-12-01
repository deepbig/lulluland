import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import {
  setCategoryList,
  getPerformances,
  setPerformanceList,
} from 'modules/performance';
import { Grid, Typography, Avatar, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PerformanceChart from 'components/effortTracker/performanceChart/PerformanceChart';
import MainCard from 'components/custom/MainCard';
import { styled } from '@mui/material/styles';
import { PerformanceData, PerformanceChartData, UserData } from 'types';
import { backgroundColors, circleColors, avatarColors } from 'lib';
import { getUser } from 'modules/user';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import db from 'db';
const COLLECTION_NAME = 'users';
const SUBCOLLECTION_NAME = 'performances';

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
  selectedCategory: string;
  selectedUser: UserData | null;
  username: string | undefined;
}

function PerformanceTrends(props: PerformanceTrendsProps) {
  const performances = useAppSelector(getPerformances);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let unsubscribe;
    if (props.selectedUser && props.selectedUser.categories.length > 0) {
      const q = query(
        collection(
          db,
          COLLECTION_NAME,
          props.selectedUser.uid,
          SUBCOLLECTION_NAME
        ),
        orderBy('category'),
        orderBy('subcategory'),
        orderBy('date', 'desc')
      );
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const performances: Array<any> = [];
        const newCategories: Array<any> = [];

        const categories = props.selectedUser?.categories;
        if (categories) {
          categories.forEach((category) => {
            newCategories.push({ category: category, subcategories: [] });
            performances.push([]);
          });

          let category = '';
          let index = -1;
          let subcategory = '';
          let subIndex = -1;

          querySnapshot.docs.forEach((_data) => {
            if (category !== _data.data().category) {
              category = _data.data().category;
              index = categories.indexOf(category);
              subIndex = -1;
            }

            if (subcategory !== _data.data().subcategory || subIndex === -1) {
              subcategory = _data.data().subcategory;
              subIndex++;
              newCategories[index].subcategories.push(subcategory);
              performances[index].push([]);
            }
            performances[index][subIndex].push({
              id: _data.id,
              ..._data.data(),
            });
          });
          dispatch(setPerformanceList(performances));
          dispatch(setCategoryList(newCategories));
        }
      });
    } else {
      dispatch(setPerformanceList([]));
      dispatch(setCategoryList([]));
    }

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedUser]);

  const createChartData = (performances: PerformanceData[]) => {
    let chartData: PerformanceChartData[] = [];
    performances?.forEach((data) =>
      chartData.unshift({
        time: data.date?.toDate().toDateString(),
        desc: data.note,
        count: data.performance,
      })
    );
    return chartData;
  };

  return (
    <>
      {performances.length < 1 ? (
        <Box m={2}>
          <Typography variant='guideline' align='center' mt={1}>
            {user && user.username === props.username
              ? "You don't have any performance history. Please add an indicator for your record!"
              : 'There is no performance history.'}
          </Typography>
        </Box>
      ) : (
        <Box m={1}></Box>
      )}
      <Grid container direction='row' spacing={2}>
        {performances?.map((performance) =>
          performance?.map((subPerformance, index) =>
            !props.selectedCategory ||
            props.selectedCategory === subPerformance[0].category ? (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                xl={3}
                key={subPerformance[0].subcategory + index}
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
                            💪{subPerformance[0]?.subcategory}
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
                            {subPerformance[0]?.performance} reps
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
                              (subPerformance[0]?.performance /
                                subPerformance[subPerformance.length - 1]
                                  ?.performance -
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
                                  subPerformance[0]?.performance >
                                  subPerformance[subPerformance.length - 1]
                                    ?.performance
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
                            {subPerformance[subPerformance.length - 1].date
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
                        <PerformanceChart
                          data={createChartData(subPerformance)}
                        />
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
