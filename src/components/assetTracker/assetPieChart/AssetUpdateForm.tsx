import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Typography,
} from '@mui/material';
import { useAppSelector } from 'hooks';
import { givenMonthYearFormat } from 'lib';
import { getAssetSummaries } from 'modules/asset';
import React, { useEffect } from 'react';
import { AssetTypes, SubAssetData } from 'types';

interface AssetUpdateFormProps {
  open: boolean;
  handleClose: () => void;
}
// dialog로 입력 필드주고 수정할 수 있도록 하기.
function AssetUpdateForm(props: AssetUpdateFormProps) {
  const assetSummaries = useAppSelector(getAssetSummaries);
  const [values, setValues] = React.useState<SubAssetData>({
    [AssetTypes.CASH]: 0,
    [AssetTypes.FIXED_INCOME]: 0,
    [AssetTypes.REAL_ASSET]: 0,
    [AssetTypes.EQUITY]: 0,
  });

  useEffect(() => {
    if (assetSummaries.length > 0) {
      setValues(assetSummaries[assetSummaries.length - 1].assets);
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

  return (
    <Dialog open={props.open}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        Asset Update Form
        <Typography variant='body1' sx={{ textAlign: 'center' }}>
          {givenMonthYearFormat(
            assetSummaries.length > 0 ? assetSummaries[0].date.toString() : null
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
              value={values[AssetTypes.CASH]}
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
              value={values[AssetTypes.FIXED_INCOME]}
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
              value={values[AssetTypes.REAL_ASSET]}
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
  );
}

export default AssetUpdateForm;
