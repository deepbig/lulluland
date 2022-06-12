import { styled } from '@mui/material/styles';
import { useAppSelector } from 'hooks';
import { getPerformances } from 'modules/performance';
import {
  Grid,
  LinearProgress,
  List,
  Typography,
  linearProgressClasses,
} from '@mui/material';
import { backgroundColors } from 'lib';

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

const goals = [12, 84, 102, 82];

interface ObjectiveProps {
  category: string;
}


function Achievements({ category } : ObjectiveProps) {
  // goals from performance.
  const performances = useAppSelector(getPerformances);

  return (
    <div>
      <List sx={{ p: 0, m: 0 }}>
        {/* TODO - Goal collection should be in the database */}
        {performances?.map((performance) =>
          performance.map((subPerformance, index) => (
            !category || category === subPerformance[0].category ?
            <LinearProgressWithLabel
              title={`${subPerformance[0].subcategory} in a set (${
                subPerformance[0].performance
              } / ${goals[index % 4]} reps)`}
              value={(subPerformance[0].performance / goals[index % 4]) * 100}
              barColor={backgroundColors[index % 5]}
              key={subPerformance[0].subcategory + index}
            />
            : null
          ))
        )}
      </List>
    </div>
  );
}

export default Achievements;
