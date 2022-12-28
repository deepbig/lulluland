import {
  Divider,
  Grid,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  getAssetSummaries,
  getTotalIncomeExpense,
  setTotalIncomeExpense,
} from 'modules/asset';
import { getUser } from 'modules/user';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { AssetData, AssetTypes, UserData } from 'types';
import MonthlyHistory from './MonthlyHistory';
import { calculateMonthlyProfitLoss } from 'lib';
import { updateAssetSummary } from 'db/repositories/asset';
import { setSnackbar } from 'modules/snackbar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MonthlyDetails from './MonthlyDetails';

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
  const [openForm, setOpenForm] = useState<'incomes' | 'expenses' | null>(null);
  const [openDetails, setOpenDetails] = useState(false);

  useEffect(() => {
    if (assetSummaries.length > 0) {
      const assetSummary = assetSummaries[assetSummaries.length - 1];

      if (assetSummary.date.toDate().getMonth() === new Date().getMonth()) {
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
      } else {
        // 만약 다른 달이면 새롭게 시작할 수 있도록 값 수정.
        // 다른 달이면 cash 계산, income, expense clear 후 페이지 refresh.
        const newAssetSummaries = {
          ...assetSummary,
          id: '',
          incomes: [],
          expenses: [],
          assets: {
            ...assetSummary.assets,
          },
        };
        newAssetSummaries.assets[AssetTypes.CASH] += calculateMonthlyProfitLoss(
          assetSummary.incomes,
          assetSummary.expenses
        );

        handleMonthChanges(newAssetSummaries);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetSummaries, dispatch]);

  const handleMonthChanges = async (newAssetSummary: AssetData) => {
    if (user?.uid) {
      try {
        await updateAssetSummary(user.uid, newAssetSummary);
        window.location.reload();
      } catch (e) {
        dispatch(
          setSnackbar({
            open: true,
            message: `Failed to create asset summary of this month. Error: ${e}`,
            severity: 'error',
          })
        );
      }
    }
  };

  const handleFormOpen = (type: 'incomes' | 'expenses') => {
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
      <Box display='flex' alignItems='center' height={264}>
        <Grid container spacing={0} justifyContent='flex-end'>
          {/* Income */}
          <Grid item xs={12}>
            <Box display='flex'>
              <Typography variant='h6'>Income</Typography>
              {user && selectedUser && user.uid === selectedUser.uid && (
                <IconButton onClick={() => handleFormOpen('incomes')}>
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
      <Button
        onClick={() => setOpenDetails(true)}
        disabled={!assetSummaries.length}
      >
        <Stack direction='row' alignItems='center' spacing={1}>
          <Typography variant='body2'>View All</Typography>
          <ArrowForwardIcon />
        </Stack>
      </Button>
      {openForm && (
        <MonthlyHistory open={openForm} handleClose={() => setOpenForm(null)} />
      )}
      {openDetails && (
        <MonthlyDetails
          open={openDetails}
          handleClose={() => setOpenDetails(false)}
          selectedUser={selectedUser}
        />
      )}
    </>
  );
}

export default MonthlySummary;
