import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { StockCountryTypes, StockTag, StockTypes } from 'types';

export interface StockState {
  stockTagList: StockTag[];
}

const initialState: StockState = {
  stockTagList: [
    {
      symbol: 'AAPL.O',
      companyName: 'Apple Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'PINS.K',
      companyName: 'Pinterest Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: '005930',
      companyName: '삼성전자',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
  ],
};

export const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockTagList: (state, action: PayloadAction<StockTag[]>) => {
      state.stockTagList = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setStockTagList, reset } = stockSlice.actions;

export const getStockTags = (state: RootState) => state.stock.stockTagList;

export default stockSlice.reducer;
