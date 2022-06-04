import { useEffect, useState, forwardRef } from 'react';
import { useAppSelector, useAppDispatch } from 'hooks';
import { getActivities, setActivityList } from 'modules/activity';
import * as activity from 'db/repositories/activity';
import Box, { BoxProps } from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import styles from './EffortTracker.module.css';
import { ActivityData } from 'types';

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

interface EffortTrackerProps {
  category: string;
  uid: string;
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default function EffortTracker(props: EffortTrackerProps) {
  const activities = useAppSelector(getActivities);
  const dispatch = useAppDispatch();
  const [selectedYear] = useState(null); // setSelectedYear는 filter 기능 추가 후 적용.
  const [monthList, setMonthList] = useState<any>([]);

  useEffect(() => {
    fetchMonthList();
  }, []);

  useEffect(() => {
    if (props.uid) {
      fetchActivities(selectedYear);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, props.uid]);

  const fetchActivities = async (selectedYear: number | null) => {
    const _activities = selectedYear
      ? await activity.selected(selectedYear, props.uid)
      : await activity.current(props.uid);
    dispatch(setActivityList(_activities));
  };

  const fetchMonthList = () => {
    const currentMonth = new Date().getMonth();
    let i = 0;
    let res = [];

    while (++i <= 12) {
      res.push(<li key={i}>{months[(currentMonth + i) % 12]}</li>);
    }

    setMonthList(res);
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
      while (
        activities.length > count &&
        props.category &&
        props.category !== activities[count].category
      ) {
        count++;
      }

      if (
        activities[count]?.date?.toDate().getTime() >= d.getTime() &&
        activities[count]?.date?.toDate().getTime() < d.getTime() + 86400000
      ) {
        let duration = 0;
        let activityCount = 0;
        let note = '';
        let date = activities[count].date.toDate().toDateString();
        do {
          if (
            !props.category ||
            props.category === activities[count].category
          ) {
            activityCount++;
            note += activities[count].note ? `${activities[count].note}\n` : '';
            duration += activities[count].duration;
          }
          count++;
        } while (
          activities[count]?.date?.toDate().getTime() >= d.getTime() &&
          activities[count]?.date?.toDate().getTime() < d.getTime() + 86400000
        );

        rows.push(
          <Tooltip
            key={`tooltip-${++index}`}
            title={
              <span style={{ whiteSpace: 'pre-line' }}>
                {date +
                  `\nNote: \n${note} Duration: ${duration} \nActivity Count: ${activityCount}`}
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
              data-level={duration / 60 <= 4 ? Math.ceil(duration / 60) : 4}
            />
          </Tooltip>
        );
      } else {
        rows.push(
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
    }
    return rows;
  };

  return (
    <div>
      <div className={styles.graph}>
        <ul className={styles.months}>{monthList}</ul>
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
          <Item key={1004} data-level={4} />
        </ul>
        Less
      </Box>
    </div>
  );
}
