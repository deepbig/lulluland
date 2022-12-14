import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppSelector } from 'hooks';
import { selectStockColor } from 'lib';
import { getAssetSummaries } from 'modules/asset';
import React, { useState, useEffect } from 'react';
import { IncomeExpenseDetailData } from 'types';
import MonthlyDetailPieChart from './MonthlyDetailPieChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
  const [expanded, setExpanded] = React.useState<string | false>(false);

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

  // Calcluating average values of recent 6 months by category.
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

    setIncomeAvg(_incomeAvg);
    setExpenseAvg(_expenseAvg);
  }, [assetSummaries]);

  const handleExpendChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const showSummaryResults = (
    detail: IncomeExpenseDetailData,
    type: 'income' | 'expense'
  ) => {
    const avg =
      type === 'income'
        ? incomeAvg.find((item) => item.category === detail.category)
        : expenseAvg.find((item) => item.category === detail.category);
    const base = assetSummaries.length > 6 ? 6 : assetSummaries.length;
    const diff = (avg ? avg.amount : 0 / base) - detail.amount;

    return (
      <Typography sx={{ color: selectStockColor(diff) }}>
        {diff > 0 ? 'Less' : 'More'} than average by ₩ {Math.abs(diff)}
      </Typography>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isSmallWidth}
      maxWidth='lg'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>Monthly Details</DialogTitle>
      <DialogContent>
        {/* TODO: previous and current pie chart (side by side. diff in middle) */}
        <Grid container direction='row' justifyContent='center' spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' align='center' gutterBottom>
              Income Details
            </Typography>
            <MonthlyDetailPieChart details={incomeDetails} />

            {incomeDetails.map((detail, index) => (
              <Accordion
                key={index}
                expanded={expanded === `expense_${detail.category}`}
                onChange={handleExpendChange(`expense_${detail.category}`)}
                sx={{ backgroundColor: 'inherit' }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {detail.category}
                  </Typography>
                  {showSummaryResults(detail, 'income')}
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {detail.details?.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${item.description} : ${item.amount}`}
                          secondary={item.date.toDate().toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant='h6' align='center' gutterBottom>
              Expense Details
            </Typography>
            <MonthlyDetailPieChart details={expenseDetails} />

            {expenseDetails.map((detail, index) => (
              <Accordion
                key={index}
                expanded={expanded === `expense_${detail.category}`}
                onChange={handleExpendChange(`expense_${detail.category}`)}
                sx={{ backgroundColor: 'inherit' }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ width: '33%', flexShrink: 0 }}>
                    {detail.category}
                  </Typography>
                  {showSummaryResults(detail, 'expense')}
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {detail.details?.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${item.description} : ${item.amount}`}
                          secondary={item.date.toDate().toLocaleString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
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
