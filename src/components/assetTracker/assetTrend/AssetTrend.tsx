import { useAppSelector } from 'hooks';
import { getAssetSummaries } from 'modules/asset';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Surface,
  Symbols,
} from 'recharts';
import { AssetTypes, SubAssetData, UserData } from 'types';
import { chipColors as colors, givenDateFormat } from 'lib/index';
import { Button, Stack, Typography } from '@mui/material';
import AssetUpdateForm from '../assetPieChart/AssetUpdateForm';
import { getUser } from 'modules/user';

interface AssetTrendDataType {
  date: string;
  assets: SubAssetData;
}

type AssetTrendProps = {
  selectedUser: UserData | null;
};

/**
 * base number가 없다면 초기 세팅 필요
 * 아님 채워넣는 형식으로 가야할 듯
 * ex) 자산 pie chart (cash, Fixed Income (bond/fixed deposits), real assets, Equities)
 * Equities 제외한 값을 입력할 때 total 값 변경.
 * total 값이 없다면 차트 가운데 입력하라는 창 표시
 * @returns
 */

function AssetTrend({ selectedUser }: AssetTrendProps) {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const user = useAppSelector(getUser);
  const categories = Object.values(AssetTypes);
  const [data, setData] = useState<Array<AssetTrendDataType>>([]);
  const [disabled, setDisabled] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (assetSummaries?.length > 0) {
      const _assetSummaries = [];
      for (const summary of assetSummaries) {
        // 같은 달에는 stocks 값은 주기적으로 업데이트 되어야 한다.
        if (summary.date.toDate().getMonth() === new Date().getMonth()) {
          let sum = 0;
          summary.stocks.forEach(
            (stock) => (sum += stock.buyPrice * stock.shares)
          );
          _assetSummaries.push({
            date: givenDateFormat(summary.date.toDate().toDateString()),
            assets: { ...summary.assets, [AssetTypes.EQUITY]: sum },
          });
        } else {
          _assetSummaries.push({
            date: givenDateFormat(summary.date.toDate().toDateString()),
            assets: { ...summary.assets },
          });
        }
      }
      setData(_assetSummaries);
    }
  }, [assetSummaries]);

  const handleClick = (dataKey: string) => {
    if (disabled.includes(dataKey)) {
      setDisabled(disabled.filter((d) => d !== dataKey));
    } else {
      setDisabled([...disabled, dataKey]);
    }
  };

  // @ts-ignore
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <div className='customized-legend'>
        {payload.map(
          (entry: { value: string; color: string }, index: number) => {
            const { value, color } = entry;
            const active = !disabled.includes(value);
            const style = {
              marginRight: 10,
              color: active ? '#FFF' : '#AAA',
            };

            return (
              <span
                className='legend-item'
                onClick={() => handleClick(value)}
                style={style}
                key={`legend-${index}`}
              >
                <Surface
                  width={10}
                  height={10}
                  viewBox={{ x: 0, y: 0, width: 10, height: 10 }}
                >
                  <Symbols cx={5} cy={5} type='circle' size={50} fill={color} />
                  {!active && (
                    <Symbols
                      cx={5}
                      cy={5}
                      type='circle'
                      size={25}
                      fill={'#FFF'}
                    />
                  )}
                </Surface>
                <span>{value}</span>
              </span>
            );
          }
        )}
      </div>
    );
  };

  return (
    <>
      {assetSummaries.length > 0 ? (
        <ResponsiveContainer height={300}>
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            {categories.map(
              (category, index) =>
                !disabled.includes(category) && (
                  <Bar
                    key={index}
                    dataKey={`assets[${category}]`}
                    name={category}
                    barSize={20}
                    stackId='a'
                    fill={colors[index % colors.length]}
                  />
                )
            )}
            <Legend
              verticalAlign='bottom'
              height={36}
              align='center'
              payload={categories.map((category, index) => ({
                value: category,
                color: colors[index % colors.length],
              }))}
              content={renderCustomizedLegend}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Stack direction='column' alignItems='center' sx={{ m: 2 }}>
          {user && selectedUser && user.uid === selectedUser.uid ? (
            <>
              <Typography variant='guideline' align='center'>
                Please add initial asset to show asset trends!
              </Typography>
              <Button onClick={() => setIsFormOpen(true)}>
                ADD INITIAL ASSET
              </Button>
            </>
          ) : (
            <Typography variant='guideline' align='center'>
              No asset history to display.
            </Typography>
          )}
        </Stack>
      )}
      {isFormOpen && (
        <AssetUpdateForm
          open={isFormOpen}
          handleClose={() => setIsFormOpen(false)}
        />
      )}
    </>
  );
}

export default AssetTrend;
