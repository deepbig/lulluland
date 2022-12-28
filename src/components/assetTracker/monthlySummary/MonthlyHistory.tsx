import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
  calculateMonthlyProfitLoss,
  currentDateTime,
  selectedDateTime,
} from 'lib';
import { getAssetSummaries, setAssetSummaryList } from 'modules/asset';
import { setSnackbar } from 'modules/snackbar';
import React, { useEffect, useState } from 'react';
import { ExpenseTypes, IncomeExpensesData, IncomeTypes } from 'types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { setBackdrop } from 'modules/backdrop';
import { getUser } from 'modules/user';
import {
  updateAssetSummaries,
  updateAssetSummary,
} from 'db/repositories/asset';
import { Timestamp } from 'firebase/firestore';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

interface Column {
  field: 'date' | 'category' | 'description' | 'amount';
  label: string;
  width: string; // percentage
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    field: 'date',
    label: 'Date',
    align: 'right',
    width: '30%',
  },
  {
    field: 'category',
    label: 'Category',
    align: 'right',
    width: '30%',
  },
  {
    field: 'description',
    label: 'Description',
    width: '30%',
    align: 'right',
  },
  {
    field: 'amount',
    label: 'Amount\u00a0(₩)',
    align: 'right',
    width: '10%',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface MonthlyHistoryProps {
  open: 'incomes' | 'expenses' | null;
  handleClose: () => void;
}

function MonthlyHistory({ open, handleClose }: MonthlyHistoryProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [updatedIncomeExpenses, setUpdatedIncomeExpenses] = useState<
    IncomeExpensesData[]
  >([]);
  const defaultNewData = {
    date: currentDateTime(),
    description: '',
    category: '',
    amount: 0,
  };
  const [newData, setNewData] = useState<IncomeExpensesData>({
    ...defaultNewData,
  });
  const categories = Object.values(
    open === 'incomes' ? IncomeTypes : ExpenseTypes
  );
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedMonthYear, setSelectedMonthYear] = useState('');
  const theme = useTheme();
  const isSmallWidth = useMediaQuery(theme.breakpoints.down('md'));
  const [isCurrentMonth, setIsCurrentMonth] = useState(true);

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

    if (!selectedMonthYear) {
      setSelectedMonthYear(assetSummary.id);
      return;
    }

    if (open) {
      setUpdatedIncomeExpenses(
        assetSummary[open] ? [...assetSummary[open]] : []
      );
    }
  }, [assetSummaries, open, selectedMonthYear]);

  const handleAdd = () => {
    const _newData = {
      ...newData,
      date: Timestamp.fromDate(new Date(newData.date)),
    };
    const newIncomeExpenses = [...updatedIncomeExpenses, _newData];
    newIncomeExpenses.sort((a, b) => {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      } else {
        return 0;
      }
    });
    setUpdatedIncomeExpenses(newIncomeExpenses);

    const currentMonthYear = new Date().toISOString().slice(0, 7);
    if (selectedMonthYear !== currentMonthYear) {
      const yearMonth = selectedMonthYear.split('-');
      if (Number.isNaN(yearMonth[0]) || Number.isNaN(yearMonth[1])) {
        throw new Error('Invalid month year format');
      }

      setNewData({
        ...defaultNewData,
        date: selectedDateTime(parseInt(yearMonth[0]), parseInt(yearMonth[1])),
      });
    } else {
      setNewData({ ...defaultNewData });
    }

    dispatch(
      setSnackbar({
        open: true,
        message: `New ${open} records is successfully added.`,
        severity: 'success',
      })
    );
  };

  const handleSave = async () => {
    if (user?.uid && open) {
      try {
        dispatch(setBackdrop(true));
        const newAssetSummaries = [...assetSummaries];

        const res = await updateAssetSummary(user.uid, {
          ...newAssetSummaries[newAssetSummaries.length - 1],
          [open]: updatedIncomeExpenses,
        });
        if (res) {
          newAssetSummaries.splice(newAssetSummaries.length - 1, 1, res);

          dispatch(setAssetSummaryList(newAssetSummaries));
          dispatch(
            setSnackbar({
              open: true,
              severity: 'success',
              message: 'Records are successfully saved.',
            })
          );
          handleClose();
        }
      } catch (error) {
        dispatch(
          setSnackbar({
            open: true,
            severity: 'error',
            message:
              'Failed to update records due to an internal server error: ' +
              error,
          })
        );
      } finally {
        dispatch(setBackdrop(false));
      }
    }
  };

  const handleHistorySave = async () => {
    if (!user?.uid || !open) {
      return;
    }

    const assetSummary = assetSummaries.find(
      (asset) => asset.id === selectedMonthYear
    );
    if (!assetSummary) {
      return;
    }

    try {
      dispatch(setBackdrop(true));

      const cashChanges = calculateMonthlyProfitLoss(
        updatedIncomeExpenses,
        assetSummary[open]
      );
      const updatedAssetSummaries = await updateAssetSummaries(
        user.uid,
        selectedMonthYear,
        open,
        updatedIncomeExpenses,
        cashChanges
      );

      if (assetSummaries) {
        const updatedSummaries = assetSummaries.map((summary) => {
          const updatedSummary = updatedAssetSummaries.find(
            (updated) => updated.id === summary.id
          );
          return updatedSummary ? updatedSummary : summary;
        });
        dispatch(setAssetSummaryList(updatedSummaries));
      }

      dispatch(
        setSnackbar({
          open: true,
          severity: 'success',
          message: 'Records are successfully saved.',
        })
      );
      handleClose();
    } catch (e) {
      dispatch(
        setSnackbar({
          open: true,
          message: `Failed to update records caused by error: ${e}`,
          severity: 'error',
        })
      );
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  const handleEdit = (idx: number) => {
    alert('This feature is not ready yet. Please wait for next release.');
  };

  const handleDelete = () => {
    const newIncomeExpenses = [...updatedIncomeExpenses];
    newIncomeExpenses.splice(selectedIndex, 1);
    setUpdatedIncomeExpenses(newIncomeExpenses);
    setSelectedIndex(-1);

    dispatch(
      setSnackbar({
        open: true,
        message: `Selected record is successfully deleted.`,
        severity: 'success',
      })
    );
    handleCancel();
  };

  const handleCancel = () => {
    setConfirmDialog(false);
    // setIsEditing(false);
  };

  const handleSelect = (e: SelectChangeEvent) => {
    setNewData({ ...newData, category: e.target.value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'date') {
      const currentYearMonth = selectedMonthYear.split('-');
      const updatedYearMonth = e.target.value.split('-');
      if (
        currentYearMonth[1] !== updatedYearMonth[1] ||
        currentYearMonth[0] !== updatedYearMonth[0]
      ) {
        dispatch(
          setSnackbar({
            open: true,
            message: 'You cannot add item to another month.',
            severity: 'error',
          })
        );
        return;
      }
    }

    setNewData({
      ...newData,
      [e.target.id]:
        e.target.id === 'amount' ? +e.target.value : e.target.value,
    });
  };

  const handleMonthChange = (isNext: boolean) => {
    if (!open) {
      return;
    }

    try {
      dispatch(setBackdrop(true));
      const index = assetSummaries.findIndex(
        (asset) => asset.id === selectedMonthYear
      );

      const currentAssetSummary = assetSummaries[index];

      if (
        JSON.stringify(updatedIncomeExpenses) !==
        JSON.stringify(currentAssetSummary[open])
      ) {
        setSnackbar({
          open: true,
          message: `Please save your current month data before you change month.`,
          severity: 'error',
        });
        return;
      }

      if (
        index < 0 ||
        (isNext && index === assetSummaries.length - 1) ||
        (!isNext && index === 0)
      ) {
        return;
      }

      // if month not current month, change month to first day of the selected month.
      const currentMonthYear = new Date().toISOString().slice(0, 7);
      const newAssetSummary = assetSummaries[index + (isNext ? 1 : -1)];

      if (newAssetSummary.id !== currentMonthYear) {
        const yearMonth = newAssetSummary.id.split('-');
        if (Number.isNaN(yearMonth[0]) || Number.isNaN(yearMonth[1])) {
          throw new Error('Invalid month year format');
        }

        setNewData({
          ...defaultNewData,
          date: selectedDateTime(
            parseInt(yearMonth[0]),
            parseInt(yearMonth[1])
          ),
        });
        setIsCurrentMonth(false);
      } else {
        setNewData({ ...defaultNewData });
        setIsCurrentMonth(true);
      }
      setSelectedMonthYear(newAssetSummary.id);
    } catch (e) {
      setSnackbar({
        open: true,
        message: `Failed to change month of asset summary. Error: ${e}`,
        severity: 'error',
      });
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  return (
    <Dialog
      open={open ? true : false}
      fullScreen={isSmallWidth}
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {open === 'incomes' ? 'Income' : 'Expenses'} Detail Form
      </DialogTitle>
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
        {/* 추가 필드 - 날짜, 타입, 노트, 금액, 추가 버튼 */}
        <Typography variant='h6'>
          {open === 'incomes' ? 'Income' : 'Expenses'} Add Form
        </Typography>
        <form
          id='income-expenses-add-form'
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <FormControl variant='standard' sx={{ mb: 1 }} fullWidth>
            <InputLabel id='category-selection-label'>Category</InputLabel>
            <Select
              labelId='category-selection-label'
              label='Category'
              required
              value={newData.category}
              onChange={handleSelect}
            >
              {categories.map((category, i) => (
                <MenuItem key={i} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            autoFocus
            required
            id='date'
            label='Date & Time'
            type='datetime-local'
            fullWidth
            variant='standard'
            value={newData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 1,
            }}
          />
          <TextField
            margin='dense'
            id='description'
            label='Description'
            fullWidth
            variant='standard'
            value={newData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth variant='standard' sx={{ mb: 2 }}>
            <InputLabel htmlFor='amount'>Amount</InputLabel>
            <Input
              id='amount'
              onChange={handleChange}
              type='number'
              margin='dense'
              required
              fullWidth
              value={newData.amount}
              startAdornment={
                <InputAdornment position='start'>₩</InputAdornment>
              }
            />
          </FormControl>
        </form>
        <Button
          type='submit'
          form='income-expenses-add-form'
          variant='contained'
          fullWidth
        >
          Add
        </Button>
        {/* 리스트 출력 - 날짜, 타입, 노트(아이콘), 금액, 수정 버튼 */}
        <Typography variant='h6' mt={2}>
          {open === 'incomes' ? 'Income' : 'Expenses'} Records
        </Typography>
        {updatedIncomeExpenses.length > 0 ? (
          <Paper>
            <TableContainer sx={{ width: '100%', overflow: 'ellipsis' }}>
              <Table stickyHeader aria-label='monthly history table'>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align}
                        style={{ width: column.width }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell padding='checkbox' style={{ width: '20%' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {updatedIncomeExpenses.map((row, idx) => (
                    <TableRow hover role='checkbox' tabIndex={-1} key={idx}>
                      {columns.map((column) => {
                        const value =
                          column.field === 'amount'
                            ? +row[column.field]
                            : row[column.field];
                        return (
                          <TableCell key={column.field} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : column.field === 'date'
                              ? value.toDate().toLocaleString()
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell padding='checkbox'>
                        <ButtonGroup disableElevation>
                          <IconButton onClick={() => handleEdit(idx)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setConfirmDialog(true);
                              setSelectedIndex(idx);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {confirmDialog && (
              <DeleteConfirmationDialog
                open={confirmDialog}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
              />
            )}
          </Paper>
        ) : (
          <Box>
            <Typography variant='guideline' align='center' mt={3}>
              There is no {open} record in this month.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={isCurrentMonth ? handleSave : handleHistorySave}
          variant='contained'
        >
          Save
        </Button>
        <Button onClick={handleClose} variant='contained'>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MonthlyHistory;
