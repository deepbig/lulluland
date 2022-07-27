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
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { useAppSelector } from 'hooks';
import { givenMonthYearFormat } from 'lib';
import { getAssetSummaries } from 'modules/asset';
import React, { useEffect, useState } from 'react';
import { AssetData, AssetTypes, StockData, SubAssetData } from 'types';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { getStockTags } from 'modules/stock';

interface AssetUpdateFormProps {
  open: boolean;
  handleClose: () => void;
}
// dialog로 입력 필드주고 수정할 수 있도록 하기.
function AssetUpdateForm(props: AssetUpdateFormProps) {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const stockTags = useAppSelector(getStockTags);
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
  });
  const [stockAddValues, setStockAddValues] = useState({
    open: false,
    symbol: '',
    companyName: '',
    country: '',
    type: '',
  });

  useEffect(() => {
    if (assetSummaries.length > 0) {
      setValues(assetSummaries[assetSummaries.length - 1]);
    }
  }, [assetSummaries]);

  const handleSubmit = async () => {
    console.log(values);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [e.target.id]: +e.target.value,
    });
  };

  const handleChangeStocks = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number
  ) => {
    const newStocks = [...values.stocks];
    const newStock = { ...values.stocks[idx], [e.target.id]: +e.target.value };
    newStocks[idx] = newStock;
    console.log(newStocks, newStock);
    setValues({
      ...values,
      stocks: newStocks,
    });
  };

  const handleChangeStockTag = (event: SelectChangeEvent) => {
    const values = event.target.value.split(',');
    setStockAddValues({
      ...stockAddValues,
      companyName: values[0],
      symbol: values[1],
      country: values[2],
      type: values[3],
    });
  };

  const handleClickStockAdd = () => {
    const newStocks = [...values.stocks];
    newStocks.push({
      symbol: stockAddValues.symbol,
      companyName: stockAddValues.companyName,
      buyPrice: 0,
      shares: 0,
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
    setStockAddValues({
      open: false,
      symbol: '',
      companyName: '',
      country: '',
      type: '',
    });
  };

  return (
    <>
      <Dialog open={props.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Asset Update Form
          <Typography variant='body1' sx={{ textAlign: 'center' }}>
            {givenMonthYearFormat(
              assetSummaries.length > 0
                ? assetSummaries[0].date.toString()
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
              <Grid container direction='row' spacing={1}>
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
                        <InputAdornment position='start'>₩</InputAdornment>
                      }
                      label="Buy Price"
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
                onClick={() =>
                  setStockAddValues({ ...stockAddValues, open: true })
                }
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
      <Dialog open={stockAddValues.open}>
        <DialogTitle sx={{ textAlign: 'center' }}>Stock Add Form</DialogTitle>
        <DialogContent>
          {/* 카테고리 south korea, united state */}
          <FormControl sx={{ mt: 1, mb: 1 }} fullWidth>
            <Select
              id='stock-to-add'
              value={
                stockAddValues.symbol
                  ? `${stockAddValues.companyName},${stockAddValues.symbol},${stockAddValues.country},${stockAddValues.type}`
                  : ''
              }
              onChange={handleChangeStockTag}
              size='small'
            >
              {stockTags.map((s) => (
                <MenuItem
                  key={s.symbol}
                  value={`${s.companyName},${s.symbol},${s.country},${s.type}`}
                >
                  {s.companyName} ({s.symbol}, {s.country}, {s.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickStockAdd} variant='contained'>
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
