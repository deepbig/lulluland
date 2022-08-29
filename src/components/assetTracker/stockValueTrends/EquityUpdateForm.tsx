import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { updateAssetSummary } from 'db/repositories/asset';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getAssetSummaries, setAssetSummaryList } from 'modules/asset';
import { setBackdrop } from 'modules/backdrop';
import { setSnackbar } from 'modules/snackbar';
import { getUser } from 'modules/user';
import React, { useState } from 'react';
import { AssetTypes, StockCountryTypes } from 'types';

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
  const user = useAppSelector(getUser);

  const handleSubmit = async () => {
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
        console.log(e);
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
          <form
            id='equity-update-form'
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextField
              id='new-currency-stock-data'
              label="Today's Currency Stock Data"
              multiline
              autoFocus
              fullWidth
              onChange={(e) => setData(e.target.value)}
              value={data}
              variant='standard'
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            type='submit'
            form='equity-update-form'
            disabled={data ? false : true}
            variant='contained'
          >
            Create
          </Button>
          <Button onClick={props.handleClose} variant='contained'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EquityUpdateForm;
