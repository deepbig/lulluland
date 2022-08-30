import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { AssetData } from 'types';

export interface AssetState {
  assetSummaryList: AssetData[];
  totalIncomeExpense: number[];
}

const initialState: AssetState = {
  assetSummaryList: [],
  totalIncomeExpense: [0, 0],
};

export const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setAssetSummaryList: (state, action: PayloadAction<AssetData[]>) => {
      state.assetSummaryList = action.payload;
    },
    setTotalIncomeExpense: (state, action: PayloadAction<number[]>) => {
      state.totalIncomeExpense = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setAssetSummaryList, setTotalIncomeExpense, reset } =
  assetSlice.actions;
export const getAssetSummaries = (state: RootState) =>
  state.asset.assetSummaryList;
export const getTotalIncomeExpense = (state: RootState) =>
  state.asset.totalIncomeExpense;
export default assetSlice.reducer;
