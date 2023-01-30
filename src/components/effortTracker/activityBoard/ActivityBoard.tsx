import { useEffect, useState, forwardRef } from 'react';
import { useAppSelector } from 'hooks';
import { getActivities, getSelectedYear } from 'modules/activity';
import Box, { BoxProps } from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import styles from './ActivityBoard.module.css';
import { ActivityData, CategoryData } from 'types';
import { months } from 'lib';

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

interface ActivityBoardProps {
  selectedCategory: CategoryData | null;
}

export default function ActivityBoard({
  selectedCategory,
}: ActivityBoardProps) {
  const activities = useAppSelector(getActivities);
  const [monthList, setMonthList] = useState<any>([]);
  const selectedYear = useAppSelector(getSelectedYear);
  const [colorCode, setColorCode] = useState(0);

  useEffect(() => {
    fetchMonthList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  useEffect(() => {
    setColorCode(selectedCategory ? selectedCategory.color : 0);
  }, [selectedCategory]);

  const fetchMonthList = () => {
    const currentMonth = selectedYear ? 12 : new Date().getMonth() + 1;
    let i = -1;
    let res = [];

    while (++i < 12) {
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
        selectedCategory &&
        selectedCategory.category !== activities[count].category
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
            !selectedCategory ||
            selectedCategory.category === activities[count].category
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
            enterTouchDelay={100}
          >
            <Item
              key={++index}
              data-toggle='tooltip'
              data-placement='bottom'
              data-animation='false'
              data-level={duration / 30 <= 4 ? Math.ceil(duration / 30) : 4}
              data-color-code={colorCode}
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
              data-color-code={colorCode}
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
          <Item key={1000} data-level={0} data-color-code={colorCode} />
          <Item key={1001} data-level={1} data-color-code={colorCode} />
          <Item key={1002} data-level={2} data-color-code={colorCode} />
          <Item key={1003} data-level={3} data-color-code={colorCode} />
          <Item key={1004} data-level={4} data-color-code={colorCode} />
        </ul>
        Less
      </Box>
    </div>
  );
}
