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
import { barColors } from 'lib';

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

const goals = [84, 12, 102, 82];

function Achievements() {
  // goals from performance.
  const performances = useAppSelector(getPerformances);

  return (
    <div>
      <List sx={{ p: 0, m: 0 }}>
        {/* TODO - Goal collection should be in the database */}
        {performances?.map((performanceData, index) =>
          performanceData.length > 1 ? (
            <LinearProgressWithLabel
              title={`${performanceData[0]?.subcategory} in a set (${
                performanceData[0].values
              } / ${goals[index % 4]} reps)`}
              value={(performanceData[0].values / goals[index % 4]) * 100}
              barColor={barColors[index % 5]}
              key={index}
            />
          ) : null
        )}
      </List>
    </div>
  );
}

export default Achievements;
