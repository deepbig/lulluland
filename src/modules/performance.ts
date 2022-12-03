import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { PerformanceCategoryData, PerformanceData } from 'types';

export interface PerformanceState {
  performanceList: Array<PerformanceData[][]>;
  categoryList: PerformanceCategoryData[];
}

const initialState: PerformanceState = {
  performanceList: [],
  categoryList: [],
};

export const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setPerformanceList: (
      state,
      action: PayloadAction<Array<PerformanceData[][]>>
    ) => {
      state.performanceList = action.payload;
    },
    setCategoryList: (state, action: PayloadAction<PerformanceCategoryData[]>) => {
      state.categoryList = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setPerformanceList, setCategoryList, reset } =
  performanceSlice.actions;
export const getPerformances = (state: RootState) =>
  state.performance.performanceList;
export const getCategories = (state: RootState) =>
  state.performance.categoryList;
export default performanceSlice.reducer;
