import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { StockHistoryData } from 'types';

export interface StockHistoryState {
  stockHistoryList: StockHistoryData[];
}

const initialState: StockHistoryState = {
  stockHistoryList: [],
};

export const stockHistorySlice = createSlice({
  name: 'stockHistory',
  initialState,
  reducers: {
    setStockHistoryList: (state, action: PayloadAction<StockHistoryData[]>) => {
      state.stockHistoryList = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setStockHistoryList, reset } = stockHistorySlice.actions;
export const getStockHistories = (state: RootState) =>
  state.stockHistory.stockHistoryList;
export default stockHistorySlice.reducer;
