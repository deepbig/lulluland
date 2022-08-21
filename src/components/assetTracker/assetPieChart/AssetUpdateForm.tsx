import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'hooks';
import { givenMonthYearFormat } from 'lib';
import {
  getAssetSummaries,
  setAssetSummaryList,
} from 'modules/asset';
import React, { useEffect, useState } from 'react';
import {
  AssetData,
  AssetTypes,
  StockCountryTypes,
  StockData,
  StockTag,
  SubAssetData,
} from 'types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStockTags } from 'modules/stock';
import { setSnackbar } from 'modules/snackbar';
import { getUser } from 'modules/user';
import { updateAssetSummary } from 'db/repositories/asset';
import { setBackdrop } from 'modules/backdrop';

interface AssetUpdateFormProps {
  open: boolean;
  handleClose: () => void;
}
// dialog로 입력 필드주고 수정할 수 있도록 하기.
function AssetUpdateForm(props: AssetUpdateFormProps) {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const stockTags = useAppSelector(getStockTags);
  const user = useAppSelector(getUser);
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<AssetData>({
    id: '',
    date: '',
    assets: {
      [AssetTypes.CASH]: 0,
      [AssetTypes.FIXED_INCOME]: 0,
      [AssetTypes.REAL_ASSET]: 0,
      [AssetTypes.EQUITY]: 0,
    } as SubAssetData,
    stocks: [] as StockData[],
    incomes: [],
    expenses: [],
  });
  const [stockFormOpen, setStockFormOpen] = useState(false);
  const defaultStockValue = {
    symbol: '',
    label: '',
    country: '',
    type: '',
  };
  const [stockAddValues, setStockAddValues] = useState({
    ...defaultStockValue,
  });

  useEffect(() => {
    if (assetSummaries.length > 0) {
      // 이번달과 같은 달인지 확인.
      const assetSummary = assetSummaries[assetSummaries.length - 1];
      // 가장 최근 달이 같은 달이면 그대로 반영
      if (assetSummary.date.toDate().getMonth() === new Date().getMonth()) {
        setValues(assetSummary);
      } else {
        // 만약 다른 달이면 새롭게 시작할 수 있도록 값 수정.
        const previous = assetSummaries[assetSummaries.length - 2];
        let totalIncome = 0;
        if (previous?.incomes) {
          for (const income of previous.incomes) {
            totalIncome += income.amount;
          }
        }

        let totalExpense = 0;
        if (previous?.expenses) {
          for (const expense of previous.expenses) {
            totalExpense += expense.amount;
          }
        }

        setValues({
          ...assetSummary,
          id: '',
          date: '',
          incomes: [],
          expenses: [],
          assets: {
            ...assetSummary.assets,
            [AssetTypes.CASH]:
              assetSummary.assets[AssetTypes.CASH] + totalIncome - totalExpense,
          },
        });
      }
    }
  }, [assetSummaries]);

  const handleSubmit = async () => {
    if (user?.uid) {
      try {
        dispatch(setBackdrop(true));
        const res = await updateAssetSummary(user.uid, values);
        if (res) {
          let updatedAssetSummaries = [...assetSummaries];
          updatedAssetSummaries.splice(
            updatedAssetSummaries.length - 1,
            1,
            res
          );
          dispatch(setAssetSummaryList(updatedAssetSummaries));
          dispatch(
            setSnackbar({
              open: true,
              severity: 'success',
              message: 'Asset is successfully updated.',
            })
          );
          props.handleClose();
        }
        dispatch(setBackdrop(false));
      } catch (error) {
        dispatch(
          setSnackbar({
            open: true,
            severity: 'error',
            message:
              'Failed to update asset infomation due to an internal server error: ' +
              error,
          })
        );
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAssets = { ...values.assets, [e.target.id]: +e.target.value };
    setValues({
      ...values,
      assets: newAssets,
    });
  };

  const handleChangeStocks = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number
  ) => {
    const newStocks = [...values.stocks];
    const newStock = { ...values.stocks[idx], [e.target.id]: +e.target.value };
    newStocks[idx] = newStock;
    let sum = 0;
    for (const stock of newStocks) {
      sum += stock.currentPrice * stock.shares * stock.currency;
    }

    setValues({
      ...values,
      stocks: newStocks,
      assets: {
        ...values.assets,
        [AssetTypes.EQUITY]: sum,
      }
    });
  };

  const handleChangeStockTag = (newValue: StockTag | null) => {
    if (!newValue) {
      setStockAddValues({ ...defaultStockValue });
      return;
    }

    // if newValue is already on the list
    if (
      values.stocks.findIndex((stock) => stock.symbol === newValue.symbol) > -1
    ) {
      dispatch(
        setSnackbar({
          open: true,
          severity: 'warning',
          message: 'Selected Stock already exists on your list.',
        })
      );
      setStockAddValues({ ...defaultStockValue });
      return;
    }

    if (newValue) {
      setStockAddValues({ ...newValue });
    }
  };

  const handleClickStockAdd = () => {
    const newStocks = [...values.stocks];
    newStocks.push({
      symbol: stockAddValues.symbol,
      companyName: stockAddValues.label,
      buyPrice: 0,
      currentPrice: 0,
      shares: 0,
      currency: 1,
      country: stockAddValues.country,
      type: stockAddValues.type,
    });
    setValues({
      ...values,
      stocks: newStocks,
    });
    handleClickStockClose();
  };

  const handleClickStockDelete = (idx: number) => {
    const newStocks = [...values.stocks];
    newStocks.splice(idx, 1);
    setValues({
      ...values,
      stocks: newStocks,
    });
  };

  const handleClickStockClose = () => {
    setStockFormOpen(false);
    setStockAddValues({ ...defaultStockValue });
  };

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Asset Update Form
          <Typography variant='body1' sx={{ textAlign: 'center' }}>
            {givenMonthYearFormat(
              assetSummaries.length > 0
                ? assetSummaries[assetSummaries.length - 1].date
                    .toDate()
                    .toString()
                : null
            )}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <form
            id='asset-update-form'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <FormControl fullWidth variant='standard' sx={{ mb: 2 }}>
              <InputLabel htmlFor='Cash'>Cash</InputLabel>
              <Input
                id='Cash'
                value={values.assets[AssetTypes.CASH]}
                onChange={handleChange}
                type='number'
                margin='dense'
                fullWidth
                startAdornment={
                  <InputAdornment position='start'>₩</InputAdornment>
                }
              />
            </FormControl>

            <FormControl fullWidth variant='standard' sx={{ mb: 2 }}>
              <InputLabel htmlFor='Fixed Income'>Fixed Income</InputLabel>
              <Input
                id='Fixed Income'
                value={values.assets[AssetTypes.FIXED_INCOME]}
                onChange={handleChange}
                type='number'
                margin='dense'
                fullWidth
                startAdornment={
                  <InputAdornment position='start'>₩</InputAdornment>
                }
              />
            </FormControl>

            <FormControl fullWidth variant='standard' sx={{ mb: 2 }}>
              <InputLabel htmlFor='Real Asset'>Real Asset</InputLabel>
              <Input
                id='Real Asset'
                value={values.assets[AssetTypes.REAL_ASSET]}
                onChange={handleChange}
                type='number'
                margin='dense'
                fullWidth
                startAdornment={
                  <InputAdornment position='start'>₩</InputAdornment>
                }
              />
            </FormControl>

            {/* Code, company name, buy price, shares */}
            <Divider />
            <Box mt={2}>
              <Typography variant='h6'>Stocks</Typography>
            </Box>
            {values.stocks.map((stock, idx) => (
              <Grid
                container
                direction='row'
                spacing={1}
                key={`${stock.symbol}`}
              >
                <Grid item xs={12}>
                  <Grid
                    container
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Grid item>
                      <Typography variant='h6'>
                        {stock.companyName} ({stock.symbol})
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton
                        aria-label='delete'
                        onClick={() => handleClickStockDelete(idx)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel htmlFor='buyPrice'>Buy Price</InputLabel>
                    <OutlinedInput
                      id='buyPrice'
                      type='number'
                      margin='dense'
                      fullWidth
                      size='small'
                      value={stock.buyPrice}
                      onChange={(e) => handleChangeStocks(e, idx)}
                      startAdornment={
                        <InputAdornment position='start'>
                          {stock.country === StockCountryTypes.USA ? '$' : '₩'}
                        </InputAdornment>
                      }
                      label='Buy Price'
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin='dense'
                    size='small'
                    id='shares'
                    label='Shares'
                    type='number'
                    fullWidth
                    onChange={(e) => handleChangeStocks(e, idx)}
                    value={stock.shares}
                    variant='outlined'
                  />
                </Grid>
              </Grid>
            ))}
            <Box display='flex' justifyContent='center' alignItems='center'>
              <IconButton
                className='add-stock-button'
                onClick={() => setStockFormOpen(true)}
              >
                <AddCircleIcon color='primary' />
              </IconButton>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type='submit' form='asset-update-form' variant='contained'>
            Update
          </Button>
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stock Add Form */}
      <Dialog open={stockFormOpen}>
        <DialogTitle sx={{ textAlign: 'center' }}>Stock Add Form</DialogTitle>
        <DialogContent>
          {/* 카테고리 south korea, united state */}
          <Autocomplete
            id='combo-box-demo'
            options={stockTags}
            sx={{ mt: 1, mb: 0, width: 300 }}
            size='small'
            onChange={(e, newValue) => handleChangeStockTag(newValue)}
            renderInput={(params) => (
              <TextField {...params} label='Stock Tag' />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickStockAdd}
            disabled={stockAddValues?.symbol ? false : true}
            variant='contained'
          >
            Create
          </Button>
          <Button onClick={handleClickStockClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AssetUpdateForm;
