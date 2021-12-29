import { useEffect, useState, forwardRef } from 'react';
import * as activity from 'db/repositories/activity';
import Box, { BoxProps } from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import styles from './EffortTracker.module.css';
import { ActivityData } from 'types/types';

const Item = forwardRef((props: BoxProps, ref) => {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        borderRadius: 0.7,
        ...sx,
      }}
      ref={ref}
      {...other}
    />
  );
});

export default function EffortTracker() {
  const [activities, setActivities] = useState<Array<ActivityData>>([]);
  const [selectedYear] = useState(null); // setSelectedYear는 filter 기능 추가 후 적용.

  useEffect(() => {
    fetchActivities(selectedYear);
  }, [selectedYear]);

  const fetchActivities = async (selectedYear: number | null) => {
    const _activities = selectedYear
      ? await activity.selected(selectedYear)
      : await activity.current();
    setActivities(_activities);
  };

  const drawBoxes = (activities: ActivityData[]) => {
    let rows = [];
    const end = selectedYear ? new Date(selectedYear + 1, 0, 1) : new Date();
    const start = selectedYear
      ? new Date(selectedYear, 0, 1)
      : new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
    for (let day = 0; day < start.getDay(); day++) {
      rows.push(<Item key={day - 7}></Item>);
    }
    let index: number = -1;
    let count: number = 0;
    for (let d = start; d < end; d.setDate(d.getDate() + 1)) {
      activities[count]?.date?.toDate().getTime() >= d.getTime() &&
      activities[count]?.date?.toDate().getTime() < d.getTime() + 86400000
        ? rows.push(
            <Tooltip
              key={`tooltip-${++index}`}
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {activities[count].date.toDate().toDateString() +
                    (activities[count]?.note
                      ? `\nNote: ${activities[count].note}`
                      : '') +
                    (activities[count]?.values
                      ? `\nDuration: ${activities[count].values}`
                      : '')}
                </span>
              }
              placement='top'
              followCursor
              arrow
            >
              <Item
                key={++index}
                data-toggle='tooltip'
                data-placement='bottom'
                data-animation='false'
                data-level={activities[count++].level}
              />
            </Tooltip>
          )
        : rows.push(
            <Tooltip
              key={`tooltip-${++index}`}
              title={d.toDateString()}
              placement='top'
              followCursor
              arrow
            >
              <Item
                key={++index}
                data-toggle='tooltip'
                data-placement='bottom'
                data-animation='false'
                data-level={0}
              />
            </Tooltip>
          );
    }
    return rows;
  };

  return (
    <div>
      <div className={styles.graph}>
        <ul className={styles.months}>
          <li>Jan</li>
          <li>Feb</li>
          <li>Mar</li>
          <li>Apr</li>
          <li>May</li>
          <li>Jun</li>
          <li>Jul</li>
          <li>Aug</li>
          <li>Sep</li>
          <li>Oct</li>
          <li>Nov</li>
          <li>Dec</li>
        </ul>
        <ul className={styles.days}>
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>

        <ul className={styles.squares}>{drawBoxes(activities)}</ul>
      </div>
      <Box sx={{ display: 'flex', flexDirection: 'row-reverse', pt: 2, pr: 1 }}>
        More
        <ul className={styles.explain}>
          <Item key={1000} data-level={0} />
          <Item key={1001} data-level={1} />
          <Item key={1002} data-level={2} />
          <Item key={1003} data-level={3} />
        </ul>
        Less
      </Box>
    </div>
  );
}
