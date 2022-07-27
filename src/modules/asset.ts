import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { AssetData } from 'types';

export interface AssetState {
  assetList: AssetData[];
  assetSummaryList: AssetData[];
}

const initialState: AssetState = {
  assetList: [],
  assetSummaryList: [],
};

export const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    setAssetList: (state, action: PayloadAction<AssetData[]>) => {
      state.assetList = action.payload;
    },
    setAssetSummaryList: (state, action: PayloadAction<AssetData[]>) => {
      state.assetSummaryList = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setAssetList, setAssetSummaryList, reset } = assetSlice.actions;

export const getAssets = (state: RootState) => state.asset.assetList;
export const getAssetSummaries = (state: RootState) =>
  state.asset.assetSummaryList;

export default assetSlice.reducer;
