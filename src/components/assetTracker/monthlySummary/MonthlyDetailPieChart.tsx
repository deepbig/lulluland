import { pieChartActiveShape } from 'components/custom/CustomPieChart';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { IncomeExpenseDetailData, IncomeExpensesData, UserData } from 'types';
import {
  numFormatter,
  numWithCommas,
  pieChartColors as colors,
  selectStockColor,
} from 'lib';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUser } from 'modules/user';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { setBackdrop } from 'modules/backdrop';
import { deletePastIncomeExpenseItem } from 'db/repositories/asset';
import { setSnackbar } from 'modules/snackbar';
import { getAssetSummaries, setAssetSummaryList } from 'modules/asset';

interface MonthlyDetailPieChartData {
  name: string;
  value: number;
}

interface MonthlyDetailPieChartProps {
  details: IncomeExpenseDetailData[];
  averages: IncomeExpenseDetailData[];
  type: 'incomes' | 'expenses';
  selectedUser: UserData | null;
}

function MonthlyDetailPieChart({
  details,
  averages,
  type,
  selectedUser,
}: MonthlyDetailPieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState<MonthlyDetailPieChartData[]>([]);
  const [expanded, setExpanded] = React.useState(-1);
  const user = useAppSelector(getUser);
  const [confirmDialog, setConfirmDialog] = useState<IncomeExpensesData | null>(
    null
  );
  const assetSummaries = useAppSelector(getAssetSummaries);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const _data = [];
    let index = -1;
    for (const detail of details) {
      index++;
      if (index < 6) {
        _data.push({
          name: detail.category,
          value: detail.amount,
        });
      } else if (index === 6) {
        _data.push({
          name: 'Etc.',
          value: detail.amount,
        });
      } else {
        _data[6].value += detail.amount;
      }
    }
    setData(_data);
    setActiveIndex(0);
    setExpanded(-1);
  }, [details]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleExpendChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (isExpanded) {
        setExpanded(panel);
        setActiveIndex(panel > 6 ? 6 : panel);
      } else {
        setExpanded(-1);
      }
    };

  const showSummaryResults = (detail: IncomeExpenseDetailData) => {
    const avg = averages.find((item) => item.category === detail.category);
    const diff = (avg ? avg.amount : 0) - detail.amount;

    return (
      <Typography
        sx={{ color: selectStockColor(type === 'incomes' ? -diff : diff) }}
      >
        {type === 'incomes' ? 'Gained ' : 'Spent '}
        {diff > 0 ? 'Less' : 'More'} than avg. by ₩{' '}
        {numFormatter(Math.abs(diff))}
      </Typography>
    );
  };

  const handleDeleteCancel = () => {
    setConfirmDialog(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!user?.uid) {
      return;
    }

    try {
      dispatch(setBackdrop(true));

      if (!confirmDialog) {
        throw new Error('confirmDialog is not selected.');
      }

      // delete selected item + update asset value of all assetSummary after the month of the deleted item
      const updatedAssetSummaries = await deletePastIncomeExpenseItem(
        user.uid,
        type,
        confirmDialog
      );

      // apply updated asset summaries
      if (assetSummaries) {
        const updatedSummaries = assetSummaries.map((summary) => {
          const updatedSummary = updatedAssetSummaries.find(
            (item) => item.id === summary.id
          );
          return updatedSummary ? updatedSummary : summary;
        });
        dispatch(setAssetSummaryList(updatedSummaries));
      }

      setConfirmDialog(null);
      setSnackbar({
        open: true,
        message: 'Asset summary deleted successfully.',
        severity: 'success',
      });
    } catch (e) {
      setSnackbar({
        open: true,
        message: `Failed to delete asset summary caused by error: ${e}`,
        severity: 'error',
      });
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  return data.length > 0 ? (
    <>
      <ResponsiveContainer minWidth={250} height={250}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={pieChartActiveShape}
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={80}
            outerRadius={100}
            dataKey='value'
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {details.map((detail, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleExpendChange(index)}
          sx={{ backgroundColor: 'inherit' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography
              sx={{
                width: '33%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {detail.category}
            </Typography>
            {/* <Typography align='right'>
              ₩ {numWithCommas(detail.amount)}
            </Typography> */}
            <Grid container direction='row'>
              <Grid item xs={11}>
                <Typography align='right'>
                  ₩ {numWithCommas(detail.amount)}
                </Typography>
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            {showSummaryResults(detail)}
            <List>
              {detail.details?.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    user &&
                    selectedUser &&
                    user.uid === selectedUser.uid && (
                      <IconButton
                        edge='end'
                        aria-label='delete'
                        onClick={() => setConfirmDialog(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemText
                    primary={`${item.description} : ${numWithCommas(
                      item.amount
                    )}`}
                    secondary={item.date.toDate().toLocaleString()}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {confirmDialog && (
        <DeleteConfirmationDialog
          open={confirmDialog ? true : false}
          handleCancel={handleDeleteCancel}
          handleDelete={handleDeleteConfirmed}
        />
      )}
    </>
  ) : (
    <Stack direction='column' alignItems='center'>
      <Box sx={{ display: 'flex', alignItems: 'center', height: 250 }}>
        <Typography variant='guideline' align='center'>
          No Data Available
        </Typography>
      </Box>
    </Stack>
  );
}

export default MonthlyDetailPieChart;
