import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import { useAppSelector } from 'hooks';
import { getAssetSummaries } from 'modules/asset';
import React, { useState, useEffect } from 'react';
import { IncomeExpenseDetailData } from 'types';
import MonthlyDetailPieChart from './MonthlyDetailPieChart';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';

interface MonthlyDetailsProps {
  open: boolean;
  handleClose: () => void;
}

function MonthlyDetails({ open, handleClose }: MonthlyDetailsProps) {
  const theme = useTheme();
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('md'));
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [incomeDetails, setIncomeDetails] = useState<IncomeExpenseDetailData[]>(
    []
  );
  const [expenseDetails, setExpenseDetails] = useState<
    IncomeExpenseDetailData[]
  >([]);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const [incomeAvg, setIncomeAvg] = useState<IncomeExpenseDetailData[]>([]);
  const [expenseAvg, setExpenseAvg] = useState<IncomeExpenseDetailData[]>([]);

  // creating selected month's income/expense details
  useEffect(() => {
    if (assetSummaries.length <= 0) {
      return;
    }

    const assetSummary = selectedMonthYear
      ? assetSummaries.find((asset) => asset.id === selectedMonthYear)
      : assetSummaries[assetSummaries.length - 1];
    if (!assetSummary) {
      return;
    }
    setSelectedMonthYear(assetSummary.id);
    let i;
    const _incomeDetails = [] as IncomeExpenseDetailData[];
    for (const income of assetSummary.incomes) {
      i = _incomeDetails.findIndex((item) => item.category === income.category);
      if (i < 0) {
        _incomeDetails.push({
          category: income.category,
          amount: income.amount,
          details: [income],
        } as IncomeExpenseDetailData);
      } else {
        _incomeDetails[i].amount += income.amount;
        _incomeDetails[i].details?.push(income);
      }
    }
    _incomeDetails.sort((a, b) => b.amount - a.amount);
    setIncomeDetails(_incomeDetails);

    const _expenseDetails = [] as IncomeExpenseDetailData[];
    for (const expense of assetSummary.expenses) {
      i = _expenseDetails.findIndex(
        (item) => item.category === expense.category
      );
      if (i < 0) {
        _expenseDetails.push({
          category: expense.category,
          amount: expense.amount,
          details: [expense],
        } as IncomeExpenseDetailData);
      } else {
        _expenseDetails[i].amount += expense.amount;
        _expenseDetails[i].details?.push(expense);
      }
    }
    _expenseDetails.sort((a, b) => b.amount - a.amount);
    setExpenseDetails(_expenseDetails);
  }, [assetSummaries, selectedMonthYear]);

  // Calcluating average values of recent 6 months by category except current month.
  useEffect(() => {
    if (assetSummaries.length <= 1) {
      return;
    }

    const _incomeAvg = [] as IncomeExpenseDetailData[];
    const _expenseAvg = [] as IncomeExpenseDetailData[];

    for (
      let i = assetSummaries.length - 2;
      i >= 0 && i >= assetSummaries.length - 7;
      i--
    ) {
      const assetSummary = assetSummaries[i];
      let index;
      for (const income of assetSummary.incomes) {
        index = _incomeAvg.findIndex(
          (item) => item.category === income.category
        );
        if (index < 0) {
          _incomeAvg.push({
            category: income.category,
            amount: income.amount,
          } as IncomeExpenseDetailData);
        } else {
          _incomeAvg[index].amount += income.amount;
        }
      }

      for (const expense of assetSummary.expenses) {
        index = _expenseAvg.findIndex(
          (item) => item.category === expense.category
        );
        if (index < 0) {
          _expenseAvg.push({
            category: expense.category,
            amount: expense.amount,
          } as IncomeExpenseDetailData);
        } else {
          _expenseAvg[index].amount += expense.amount;
        }
      }
    }

    // if assetSummaries.length is less than 7, then divide by assetSummaries.length - 1
    const base = assetSummaries.length - 1 > 6 ? 6 : assetSummaries.length - 1;
    _incomeAvg.map((item) => (item.amount /= base));
    _expenseAvg.map((item) => (item.amount /= base));

    setIncomeAvg(_incomeAvg);
    setExpenseAvg(_expenseAvg);
  }, [assetSummaries]);

  const handleMonthChange = (isNext: boolean) => {
    try {
      setBackdrop(true);
      const index = assetSummaries.findIndex(
        (asset) => asset.id === selectedMonthYear
      );
      if (
        index < 0 ||
        (isNext && index === assetSummaries.length - 1) ||
        (!isNext && index === 0)
      ) {
        return;
      }
      setSelectedMonthYear(assetSummaries[index + (isNext ? 1 : -1)].id);
    } catch (e) {
      setSnackbar({
        open: true,
        message: 'Failed to change month of asset summary.',
        severity: 'error',
      });
    } finally {
      setBackdrop(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isSmallWidth}
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Monthly Details</DialogTitle>
      {/* TODO: year month list */}
      <Stack direction='row' alignItems='center' justifyContent='center'>
        <IconButton
          disabled={selectedMonthYear === assetSummaries[0].id}
          onClick={() => handleMonthChange(false)}
        >
          <ArrowLeftIcon />
        </IconButton>
        <Link component='button' color='inherit'>
          <Typography sx={{ textAlign: 'center', textDecoration: 'underline' }}>
            {selectedMonthYear}
          </Typography>
        </Link>
        <IconButton
          disabled={
            selectedMonthYear === assetSummaries[assetSummaries.length - 1].id
          }
          onClick={() => handleMonthChange(true)}
        >
          <ArrowRightIcon />
        </IconButton>
      </Stack>
      <DialogContent>
        <Grid container direction='row' justifyContent='center' spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' align='center' gutterBottom>
              Income Details
            </Typography>
            <MonthlyDetailPieChart
              details={incomeDetails}
              averages={incomeAvg}
              type='income'
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h6' align='center' gutterBottom>
              Expense Details
            </Typography>
            <MonthlyDetailPieChart
              details={expenseDetails}
              averages={expenseAvg}
              type='expense'
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MonthlyDetails;
