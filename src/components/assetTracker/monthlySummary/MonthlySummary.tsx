import { Divider, Grid, Box, Typography, IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getAssetSummaries,
  getTotalIncomeExpense,
  setTotalIncomeExpense,
} from 'modules/asset';
import { getUser } from 'modules/user';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { UserData } from 'types';
import MonthlyHistory from './MonthlyHistory';

type MonthlySummaryProps = {
  selectedUser: UserData | null;
};

/**
 * 이번달 통계 전체 (가용자산, 소득, 비용)
 * 반복 작업 설정(날짜, 금액, 타입), 반복 리스트 수정 기능
 * @returns
 */
function MonthlySummary({ selectedUser }: MonthlySummaryProps) {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const user = useAppSelector(getUser);
  const totalIncomeExpense = useAppSelector(getTotalIncomeExpense);
  const dispatch = useAppDispatch();
  const [openForm, setOpenForm] = useState<'income' | 'expenses' | null>(null);

  useEffect(() => {
    if (assetSummaries.length > 0) {
      const assetSummary = assetSummaries[assetSummaries.length - 1];

      let totalIncome = 0;
      if (assetSummary.incomes) {
        for (const income of assetSummary.incomes) {
          totalIncome += income.amount;
        }
      }

      let totalExpenses = 0;
      if (assetSummary.expenses) {
        for (const expense of assetSummary.expenses) {
          totalExpenses += expense.amount;
        }
      }
      dispatch(setTotalIncomeExpense([totalIncome, totalExpenses]));
    }
  }, [assetSummaries, dispatch]);

  const handleFormOpen = (type: 'income' | 'expenses') => {
    if (
      assetSummaries[assetSummaries.length - 1].date.toDate().getMonth() ===
      new Date().getMonth()
    ) {
      setOpenForm(type);
    } else {
      alert(
        'Asset Summary for this month is not created yet. Please update asset summary first.'
      );
    }
  };

  return (
    <>
      <Box>
        <Grid container spacing={0} justifyContent='flex-end'>
          {/* Income */}
          <Grid item xs={12}>
            <Box display='flex'>
              <Typography variant='h6'>Income</Typography>
              {user && selectedUser && user.uid === selectedUser.uid && (
                <IconButton onClick={() => handleFormOpen('income')}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
          <Typography variant='h5'>
            ₩ {totalIncomeExpense[0].toLocaleString('en-US')}
          </Typography>

          {/* Expenses */}
          <Grid item xs={12}>
            <Box display='flex'>
              <Typography variant='h6'>Expenses</Typography>
              {user && selectedUser && user.uid === selectedUser.uid && (
                <IconButton onClick={() => handleFormOpen('expenses')}>
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Grid>
          <Typography variant='h5'>
            ₩ {totalIncomeExpense[1].toLocaleString('en-US')}
          </Typography>
          {/* Net Income */}
          <Grid item xs={12}>
            <Divider />
            <Typography variant='h6' sx={{ paddingTop: 1 }}>
              Net Income
            </Typography>
          </Grid>
          <Typography variant='h5'>
            ₩{' '}
            {(totalIncomeExpense[0] - totalIncomeExpense[1]).toLocaleString(
              'en-US'
            )}
          </Typography>
        </Grid>
      </Box>
      {openForm && (
        <MonthlyHistory
          open={openForm}
          handleClose={() => setOpenForm(null)}
          data={assetSummaries[assetSummaries.length - 1]}
        />
      )}
    </>
  );
}

export default MonthlySummary;
