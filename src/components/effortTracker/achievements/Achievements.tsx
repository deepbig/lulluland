import React from 'react';
import { styled } from '@mui/material/styles';
import { useAppSelector } from 'hooks';
import { getPerformanceChartData } from 'modules/performance';
import {
  Grid,
  LinearProgress,
  List,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import { backgroundColors } from 'lib';
import { CategoryData, PerformanceData } from 'types';
import { getSelectedUser } from 'modules/user';

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'barColor',
})<{ barColor: string }>(({ barColor }) => ({
  height: 8,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#fff',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: barColor,
  },
}));

interface LinearProgressProps {
  title: string;
  value: number;
  barColor: string;
}

const LinearProgressWithLabel = ({
  title,
  value,
  barColor,
}: LinearProgressProps) => {
  return (
    <Grid container direction='column' spacing={1} sx={{ mt: 1.5 }}>
      <Grid item>
        <Grid container justifyContent='space-between'>
          <Grid item>
            <Typography variant='body1'>{title}</Typography>
          </Grid>
          <Grid item>
            <Typography variant='body1' color='inherit'>{`${Math.round(
              value
            )}%`}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <BorderLinearProgress
          variant='determinate'
          value={value <= 100 ? value : 100}
          barColor={barColor}
        />
      </Grid>
    </Grid>
  );
};

interface ObjectiveProps {
  selectedCategory: CategoryData | null;
}

function Achievements({ selectedCategory }: ObjectiveProps) {
  // goals from performance.
  const selectedUser = useAppSelector(getSelectedUser);
  const performanceChartData = useAppSelector(getPerformanceChartData);

  const renderAchievementsChart = (subPerformance: PerformanceData) => {
    const categoryData = selectedUser?.categories?.find(
      (category) => category.category === subPerformance.category
    );
    const subcategoryData = categoryData?.subcategories.find(
      (subcategory) => subcategory.name === subPerformance.subcategory
    );

    return (
      categoryData &&
      subcategoryData &&
      subcategoryData.goal && (
        <LinearProgressWithLabel
          title={`${subcategoryData.name} in a set (${subPerformance?.performance} / ${subcategoryData.goal} reps)`}
          value={(subPerformance?.performance / subcategoryData.goal) * 100}
          barColor={backgroundColors[categoryData.color]}
          key={`${categoryData.category}_${subcategoryData.name}`}
        />
      )
    );
  };

  return (
    <div>
      <List sx={{ p: 0, m: 0 }}>
        {/* TODO - Goal collection should be in the database */}
        {performanceChartData?.map((performance) =>
          performance.map((subPerformance, index) =>
            subPerformance[0]?.category &&
            (!selectedCategory ||
              selectedCategory.category === subPerformance[0].category)
              ? renderAchievementsChart(
                  subPerformance[subPerformance.length - 1]
                )
              : null
          )
        )}
      </List>
    </div>
  );
}

export default Achievements;
