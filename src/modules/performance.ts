import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import {
  CategoryData,
  PerformanceData,
} from 'types';

export interface PerformanceState {
  performanceList: PerformanceData[];
  performanceChartData: Array<Array<PerformanceData[]>>; // categoryArray[ performanceArray[ ...values ] ]
  categoryList: CategoryData[];
}

const initialState: PerformanceState = {
  performanceList: [],
  performanceChartData: [],
  categoryList: [],
};

export const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setPerformanceList: (state, action: PayloadAction<PerformanceData[]>) => {
      state.performanceList = action.payload;
    },
    setPerformanceChartData: (
      state,
      action: PayloadAction<Array<Array<PerformanceData[]>>>
    ) => {
      state.performanceChartData = action.payload;
    },
    setCategoryList: (
      state,
      action: PayloadAction<CategoryData[]>
    ) => {
      state.categoryList = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setPerformanceList,
  setPerformanceChartData,
  setCategoryList,
  reset,
} = performanceSlice.actions;
export const getPerformances = (state: RootState) =>
  state.performance.performanceList;
export const getPerformanceChartData = (state: RootState) =>
  state.performance.performanceChartData;
export const getCategories = (state: RootState) =>
  state.performance.categoryList;
export default performanceSlice.reducer;
