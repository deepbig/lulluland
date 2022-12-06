import { useAppSelector } from 'hooks';
import { getActivitySummaries } from 'modules/activity';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from 'recharts';
import { chipColors as colors, numWithCommas } from 'lib/index';
import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { getUser } from 'modules/user';
import { CategoryData, UserData } from 'types';
import { grey } from '@mui/material/colors';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

interface ActivityTrendData {
  label: string;
  value: { [category: string]: number };
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    let totalValue = 0;
    payload?.map((payload) => (totalValue += payload.value as number));
    return (
      <div>
        <Card sx={{ backgroundColor: grey[800], border: 'none' }}>
          <CardContent style={{ padding: 7 }}>
            <Typography variant='body2'>
              {payload && payload[0] && payload[0].payload.label}
            </Typography>

            {payload?.map((payload, idx) => (
              <Typography
                key={idx}
                variant='body2'
                style={{ color: payload.color }}
              >
                {payload.name}: {numWithCommas(payload.value as number)}
              </Typography>
            ))}
            <Divider />
            <Typography variant='body2'>
              Total: {numWithCommas(totalValue)}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
  return null;
};

function ActivityTrend({
  selectedCategory,
  selectedUser,
}: {
  selectedCategory: CategoryData | null;
  selectedUser: UserData | null;
}) {
  const activitySummaries = useAppSelector(getActivitySummaries);
  const user = useAppSelector(getUser);
  const [data, setData] = useState<ActivityTrendData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    if (activitySummaries?.length > 0) {
      // 다 만들고 하나씩 수정해서 넣는 방식 사용.
      let year = new Date().getFullYear();
      let month = new Date().getMonth() + 1;
      let count = 0;
      let newData = [] as ActivityTrendData[];

      while (count < 12) {
        if (month === 0) {
          year -= 1;
          month = 12;
        }
        newData.unshift({
          label: `${year}-${month}`,
          value: {},
        });
        month--;
        count++;
      }

      if (selectedCategory) {
        newData = generateNewData(selectedCategory.category, newData);
        setCategories([selectedCategory]);
      } else {
        const categories = selectedUser?.categories ? [...selectedUser.categories] : [];
        // 여기서 기존 리스트가 없어짐. 다른 category를 지움.
        categories.forEach((category) => {
          newData = generateNewData(category.category, newData);
        });
        setCategories(categories);
      }
      setData(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activitySummaries, selectedCategory]);

  const generateNewData = (
    selectedCategory: string,
    newData: ActivityTrendData[]
  ) => {
    const found = activitySummaries.find(
      (summary) => summary.category === selectedCategory
    );
    if (found) {
      if (found.yearly[0]?.monthly) {
        const foundYear = found.yearly[0].year;
        for (const value of found.yearly[0]?.monthly) {
          const idx = newData.findIndex(
            (data) => data.label === `${foundYear}-${value.month}`
          );
          if (idx > -1) {
            newData[idx].value = {
              ...newData[idx].value,
              [selectedCategory]: value.durations,
            };
          }
        }
      }
      if (found.yearly[1]?.monthly) {
        const foundYear = found.yearly[1].year;
        for (const value of found.yearly[1]?.monthly) {
          const idx = newData.findIndex(
            (data) => data.label === `${foundYear}-${value.month}`
          );
          if (idx > -1) {
            newData[idx].value = {
              ...newData[idx].value,
              [selectedCategory]: value.durations,
            };
          }
        }
      }
    }
    return newData as ActivityTrendData[];
  };

  return (
    <>
      {activitySummaries.length > 0 ? (
        <ResponsiveContainer height={322}>
          <BarChart width={500} height={320} data={data}>
            <XAxis dataKey='label' />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            {categories.map((category, index) => (
              <Bar
                key={index}
                dataKey={`value.${category.category}`}
                name={category.category}
                stackId='a'
                barSize={20}
                fill={colors[category.color]}
              />
            ))}
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Stack direction='column' alignItems='center' sx={{ m: 2 }}>
          {user && selectedUser && user.uid === selectedUser.uid ? (
            <>
              <Typography variant='guideline' align='center'>
                Please add initial activity to show monthly trends!
              </Typography>
            </>
          ) : (
            <Typography variant='guideline' align='center'>
              No asset history to display.
            </Typography>
          )}
        </Stack>
      )}
    </>
  );
}

export default ActivityTrend;
