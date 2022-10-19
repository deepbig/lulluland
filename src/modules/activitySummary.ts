import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { ActivitySummaryData } from 'types';

export interface ActivitySummaryState {
  activitySummaryList: ActivitySummaryData[];
}

const initialState: ActivitySummaryState = {
  activitySummaryList: [],
};

export const activitySummarySlice = createSlice({
  name: 'activitySummary',
  initialState,
  reducers: {
    setActivitySummaryList: (
      state,
      action: PayloadAction<ActivitySummaryData[]>
    ) => {
      state.activitySummaryList = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setActivitySummaryList, reset } = activitySummarySlice.actions;
export const getActivitySummaries = (state: RootState) =>
  state.activitySummary.activitySummaryList;
export default activitySummarySlice.reducer;
