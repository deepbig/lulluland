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
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import { currentDateTime, givenMonthYearFormat } from 'lib';
import { getAssetSummaries, setAssetSummaryList } from 'modules/asset';
import { setSnackbar } from 'modules/snackbar';
import React, { useState } from 'react';
import {
  AssetData,
  ExpenseTypes,
  IncomeExpensesData,
  IncomeTypes,
} from 'types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';
// import ClearIcon from '@mui/icons-material/Clear';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { setBackdrop } from 'modules/backdrop';
import { getUser } from 'modules/user';
import { updateAssetSummary } from 'db/repositories/asset';

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
    width: '20%',
  },
  {
    field: 'category',
    label: 'Category',
    align: 'right',
    width: '10%',
  },
  {
    field: 'description',
    label: 'Description',
    width: '10%',
    align: 'right',
  },
  {
    field: 'amount',
    label: 'Amount\u00a0(₩)',
    align: 'right',
    width: '40%',
    format: (value: number) => value.toLocaleString('en-US'),
  },
];

interface MonthlyHistoryProps {
  open: 'income' | 'expenses' | null;
  handleClose: () => void;
  data: AssetData;
}

function MonthlyHistory(props: MonthlyHistoryProps) {
  const { open, handleClose, data } = props;
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [updatedIncomeExpenses, setUpdatedIncomeExpenses] = useState<
    IncomeExpensesData[]
  >(
    data[open === 'income' ? 'incomes' : 'expenses']
      ? [...data[open === 'income' ? 'incomes' : 'expenses']]
      : []
  );
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
    open === 'income' ? IncomeTypes : ExpenseTypes
  );
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  // const [isEditing, setIsEditing] = useState(false);

  const handleAdd = () => {
    const newIncomeExpenses = [...updatedIncomeExpenses, newData];
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
    setNewData({ ...defaultNewData });
    dispatch(
      setSnackbar({
        open: true,
        message: `New ${open} records is successfully added.`,
        severity: 'success',
      })
    );
  };

  const handleSave = async () => {
    if (user?.uid) {
      try {
        dispatch(setBackdrop(true));
        const newAssetSummaries = [...assetSummaries];
        const res = await updateAssetSummary(user.uid, {
          ...newAssetSummaries[newAssetSummaries.length - 1],
          [open === 'income' ? 'incomes' : 'expenses']: updatedIncomeExpenses,
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
    setNewData({
      ...newData,
      [e.target.id]:
        e.target.id === 'amount' ? +e.target.value : e.target.value,
    });
  };

  return (
    <Dialog open={open ? true : false}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {open === 'income' ? 'Income' : 'Expenses'} Detail Form
        <Typography variant='body1' sx={{ textAlign: 'center' }}>
          {givenMonthYearFormat(
            data.date ? data.date.toDate().toString() : null
          )}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* 추가 필드 - 날짜, 타입, 노트, 금액, 추가 버튼 */}
        <Typography variant='h6'>
          {open === 'income' ? 'Income' : 'Expenses'} Add Form
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
          {open === 'income' ? 'Income' : 'Expenses'} Records
        </Typography>
        {updatedIncomeExpenses.length > 0 ? (
          <Paper sx={{ width: '100%', overflow: 'ellipsis' }}>
            <TableContainer sx={{ maxHeight: 500 }}>
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
        {/* 추가, 수정 버튼은 현재 month만 가능하도록 */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant='contained'>
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
