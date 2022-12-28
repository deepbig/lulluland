import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { createStockHistory, updateAssetSummary } from 'db/repositories/asset';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getAssetSummaries, setAssetSummaryList } from 'modules/asset';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import { currentDateTime } from 'lib';
import { AssetTypes, StockCountryTypes, StockHistoryData } from 'types';
import { getStockHistories, setStockHistoryList } from 'modules/stockHistory';

interface EquityUpdateFormProps {
  open: boolean;
  handleClose: () => void;
}

interface EquityDataType {
  symbol: string;
  localTradedAt: string;
  closePrice: string;
}

function EquityUpdateForm(props: EquityUpdateFormProps) {
  const [data, setData] = useState<string>('');
  const dispatch = useAppDispatch();
  const assetSummaries = useAppSelector(getAssetSummaries);
  const stockHistories = useAppSelector(getStockHistories);
  const user = useAppSelector(getUser);
  const [option, setOption] = useState(0);
  const defaultStockHistory = {
    id: '',
    date: currentDateTime(),
    symbol: '',
    companyName: '',
    buyPrice: 0,
    sellPrice: 0,
    shares: 0,
    country: '',
    currency: 1,
  };
  const [stockHistory, setStockHistory] = useState<StockHistoryData>({
    ...defaultStockHistory,
  });

  // Form의 상단에 selection 필드 선택하면
  // 선택된 stock의 current Price, shares, currency 입력 필드에 자동으로 넣어주기.
  // 사용자가 sold price, shares, currency 수정해서 save/update 하면 stock history에 추가되고
  // cash 값 변경
  // 다른 stock 구매 시 cash는 자동으로 변경되도록 수정.
  const handleStockHistoryCreate = async () => {
    if (user) {
      try {
        dispatch(setBackdrop(true));
        const assetSummary = { ...assetSummaries[assetSummaries.length - 1] };
        const updatedAssets = { ...assetSummary.assets };

        // 2.1. cash 업데이트
        updatedAssets[AssetTypes.CASH] += Math.round(
          stockHistory.shares * stockHistory.sellPrice * stockHistory.currency
        );
        // 2.2. equity 정리 (다 팔았으면 삭제, 남았으면 share 수 변경)
        // 2.3. Equity는 currentPrice로 계산해야 함.
        // 2.4. stocks에서도 빼야 함.
        const stockIdx = assetSummary.stocks.findIndex(
          (stock) => stock.symbol === stockHistory.symbol
        );
        if (stockIdx === -1) {
          throw new Error('Stock not found');
        }
        const stock = assetSummary.stocks[stockIdx];
        const updatedStocks = [...assetSummary.stocks];
        if (updatedStocks[stockIdx].shares === stockHistory.shares) {
          updatedStocks.splice(stockIdx, 1);
        } else {
          updatedStocks[stockIdx] = {
            ...updatedStocks[stockIdx],
            shares: updatedStocks[stockIdx].shares - stockHistory.shares,
          };
        }
        assetSummary.stocks = updatedStocks;

        updatedAssets[AssetTypes.EQUITY] -=
          stock.currentPrice * stockHistory.shares * stock.currency;

        assetSummary.assets = updatedAssets;

        const addedStockHistory = await createStockHistory(
          user.uid,
          stockHistory,
          assetSummary
        );

        if (addedStockHistory) {
          const _stockHistories = [...stockHistories];
          _stockHistories.push(addedStockHistory);
          dispatch(setStockHistoryList(_stockHistories));

          let updatedAssetSummaries = [...assetSummaries];
          updatedAssetSummaries.splice(
            updatedAssetSummaries.length - 1,
            1,
            assetSummary
          );

          props.handleClose();

          dispatch(setAssetSummaryList(updatedAssetSummaries));
          dispatch(
            setSnackbar({
              open: true,
              message: 'Your equity information is successfully updated!',
              severity: 'success',
            })
          );
        } else {
          dispatch(
            setSnackbar({
              open: true,
              message:
                'Failed to update your equity information due to database error!',
              severity: 'error',
            })
          );
        }
      } catch (e) {
        dispatch(
          setSnackbar({
            open: true,
            message: `Error occured while updating your equity information! Error: ${e}`,
            severity: 'error',
          })
        );
      } finally {
        dispatch(setBackdrop(false));
      }
    }
  };

  const handleStockHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'shares') {
      const selected = assetSummaries[assetSummaries.length - 1].stocks.find(
        (stock) => stock.symbol === stockHistory.symbol
      );

      if (selected && selected.shares < +e.target.value) {
        dispatch(
          setSnackbar({
            open: true,
            message: `You do not have enough shares to sell. (number of share you have: ${selected.shares})`,
            severity: 'error',
          })
        );
        return;
      }
    }

    if (!isNaN(+e.target.value) && 0 >= +e.target.value) {
      dispatch(
        setSnackbar({
          open: true,
          message: 'Invalid stock data to sell.',
          severity: 'error',
        })
      );
    } else {
      setStockHistory({
        ...stockHistory,
        [e.target.id]: isNaN(+e.target.value)
          ? e.target.value
          : +e.target.value,
      });
    }
  };

  // const handleOnSelect = (selected: StockData) => {
  const handleOnSelect = (e: SelectChangeEvent) => {
    if (e.target.value) {
      const selected = assetSummaries[assetSummaries.length - 1].stocks.find(
        (stock) => stock.companyName === e.target.value
      );

      if (selected) {
        setStockHistory({
          ...stockHistory,
          symbol: selected.symbol,
          companyName: selected.companyName,
          buyPrice: selected.buyPrice,
          sellPrice: selected.currentPrice,
          shares: selected.shares,
          country: selected.country,
          currency: selected.currency,
        });
      } else {
        setSnackbar({
          open: true,
          message: "You don't have selected stock to sell.",
          severity: 'error',
        });
        setStockHistory({
          ...defaultStockHistory,
        });
      }
    }
  };

  const handleEquityUpdate = async () => {
    if (user) {
      try {
        dispatch(setBackdrop(true));
        let obj = JSON.parse(data);

        const assetSummary = { ...assetSummaries[assetSummaries.length - 1] };
        // currecy 업데이트
        const currency_USD = parseFloat(
          obj.values[0].closePrice.replace(/,/g, '')
        );

        const updatedStocks = assetSummary.stocks.map((stock) => {
          const equityData = obj.values.find(
            (value: EquityDataType) => value.symbol === stock.symbol
          );
          if (equityData) {
            const newStock = { ...stock };
            newStock.currentPrice = parseFloat(
              equityData.closePrice.replace(/,/g, '')
            );
            if (newStock.country === StockCountryTypes.USA) {
              newStock.currency = currency_USD;
            }
            return newStock;
          } else {
            return stock;
          }
        });
        let sum = 0;
        for (const stock of updatedStocks) {
          sum += stock.currentPrice * stock.shares * stock.currency;
        }

        const res = await updateAssetSummary(user.uid, {
          ...assetSummary,
          stocks: updatedStocks,
          assets: {
            ...assetSummary.assets,
            [AssetTypes.EQUITY]: +sum.toFixed(2),
          },
        });

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
              message: 'Your equity information is successfully updated!',
              severity: 'success',
            })
          );

          props.handleClose();
        } else {
          dispatch(
            setSnackbar({
              open: true,
              message:
                'Failed to update your equity information due to database error!',
              severity: 'error',
            })
          );
        }

        // stock 값 업데이트
        // Equity 총 값 변경

        // firestore update 수행
      } catch (e) {
        dispatch(
          setSnackbar({
            open: true,
            message: 'Invalid JSON. Please provide a valid input!',
            severity: 'error',
          })
        );
      } finally {
        dispatch(setBackdrop(false));
      }
    }
  };

  return (
    <>
      <Dialog open={props.open} fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          Equity Update Form
        </DialogTitle>

        <DialogContent>
          {!option && (
            <Stack
              spacing={2}
              direction='row'
              divider={<Divider orientation='vertical' flexItem />}
              justifyContent='center'
            >
              <Button variant='outlined' onClick={() => setOption(1)}>
                Stock History
              </Button>
              <Button variant='outlined' onClick={() => setOption(2)}>
                Today's Price
              </Button>
            </Stack>
          )}
          {option === 1 && (
            <form
              id='stock-history-form'
              onSubmit={(e) => {
                e.preventDefault();
                handleStockHistoryCreate();
              }}
            >
              <FormControl variant='standard' sx={{ mb: 1 }} fullWidth>
                <InputLabel id='stock-selection-label'>Stock</InputLabel>
                <Select
                  labelId='stock-selection-label'
                  label='Company Name'
                  required
                  value={stockHistory.companyName}
                  onChange={handleOnSelect}
                >
                  {assetSummaries[assetSummaries.length - 1].stocks.map(
                    (stock, i) => (
                      <MenuItem key={i} value={stock.companyName}>
                        {stock.companyName}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              {stockHistory.symbol && (
                <>
                  <TextField
                    autoFocus
                    required
                    id='date'
                    label='Date & Time'
                    type='datetime-local'
                    fullWidth
                    variant='standard'
                    value={stockHistory.date}
                    onChange={handleStockHistoryChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 1,
                    }}
                  />

                  <FormControl fullWidth variant='standard' sx={{ mt: 1 }}>
                    <InputLabel htmlFor='sellPrice'>Sell Price</InputLabel>
                    <Input
                      id='sellPrice'
                      type='number'
                      margin='dense'
                      fullWidth
                      size='small'
                      value={stockHistory.sellPrice}
                      onChange={handleStockHistoryChange}
                      startAdornment={
                        <InputAdornment position='start'>
                          {stockHistory.country === StockCountryTypes.USA
                            ? '$'
                            : '₩'}
                        </InputAdornment>
                      }
                    />
                  </FormControl>

                  <TextField
                    margin='dense'
                    size='small'
                    id='shares'
                    label='Shares'
                    type='number'
                    fullWidth
                    onChange={handleStockHistoryChange}
                    value={stockHistory.shares}
                    variant='standard'
                  />

                  {stockHistory.country === StockCountryTypes.USA && (
                    <TextField
                      margin='dense'
                      size='small'
                      id='currency'
                      label='Currency'
                      type='number'
                      fullWidth
                      onChange={handleStockHistoryChange}
                      value={stockHistory.currency}
                      variant='standard'
                    />
                  )}
                </>
              )}
            </form>
          )}
          {option === 2 && (
            <form
              id='equity-update-form'
              onSubmit={(e) => {
                e.preventDefault();
                handleEquityUpdate();
              }}
            >
              <TextField
                id='new-currency-stock-data'
                label="Today's Currency & Stock Data"
                multiline
                autoFocus
                fullWidth
                onChange={(e) => setData(e.target.value)}
                value={data}
                variant='standard'
              />
            </form>
          )}
        </DialogContent>
        <DialogActions>
          {option === 1 && (
            <Button
              type='submit'
              form='stock-history-form'
              disabled={stockHistory.companyName ? false : true}
              variant='contained'
            >
              Create
            </Button>
          )}
          {option === 2 && (
            <Button
              type='submit'
              form='equity-update-form'
              disabled={data ? false : true}
              variant='contained'
            >
              Update
            </Button>
          )}
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EquityUpdateForm;
