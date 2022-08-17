import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { StockCountryTypes, StockTag, StockTypes } from 'types';

export interface StockState {
  stockTagList: StockTag[];
}

const initialState: StockState = {
  stockTagList: [
    {
      symbol: 'AXL',
      label: 'American Axle & Manufact. Holdings, Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'JNJ',
      label: 'Johnson & Johnso',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'KO',
      label: 'Coca-Cola Co',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'MMM',
      label: '3M Co',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'PINS.K',
      label: 'Pinterest Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'PLTR.K',
      label: 'Palantir Technologies Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'RERE.K',
      label: 'ATRenew Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'T',
      label: 'AT&T Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'VIS',
      label: 'Vanguard Industrials Index Fund ETF',
      country: StockCountryTypes.USA,
      type: StockTypes.ETF,
    },
    {
      symbol: 'VTV',
      label: 'Vanguard Value Index Fund ETF',
      country: StockCountryTypes.USA,
      type: StockTypes.ETF,
    },
    {
      symbol: 'XOM',
      label: 'Exxon Mobil Corp',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'AMZN.O',
      label: 'Amazon.com, Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'ATHA.O',
      label: 'Athira Pharma Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'BMRN.O',
      label: 'Biomarin Pharmaceutical Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'POOL.O',
      label: 'Pool Corporation',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: 'WBD.O',
      label: 'Warner Bros Discovery Inc',
      country: StockCountryTypes.USA,
      type: StockTypes.STOCK,
    },
    {
      symbol: '005930',
      label: '삼성전자',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '005935',
      label: '삼성전자우',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '035420',
      label: '네이버',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '055550',
      label: '신한지주',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '086790',
      label: '하나금융지주',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '161510',
      label: 'ARIRANG 고배당주',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '329200',
      label: 'TIGER 리츠부동산인프라',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '360750',
      label: 'TIGER 미국 S&P500',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '379780',
      label: 'KBSTAR 미국 S&P500',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '361570',
      label: '알비더블유',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '394670',
      label: 'TIGER 글로벌리튬&2차전지SOLACTIVE',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '411420',
      label: 'KODEX 미국메타버스나스닥액티브',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '016360',
      label: '삼성증권',
      country: StockCountryTypes.KOR,
      type: StockTypes.STOCK,
    },
    {
      symbol: '373220',
      label: 'LG에너지솔루션',
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
