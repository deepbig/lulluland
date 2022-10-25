import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { ActivityData, ActivitySummaryData } from 'types';

export interface ActivityState {
  activityList: ActivityData[];
  selectedYear: number;
  activitySummaryList: ActivitySummaryData[];
}

const initialState: ActivityState = {
  activityList: [],
  selectedYear: 0,
  activitySummaryList: [],
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivityList: (state, action: PayloadAction<ActivityData[]>) => {
      state.activityList = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
    setActivitySummaryList: (
      state,
      action: PayloadAction<ActivitySummaryData[]>
    ) => {
      state.activitySummaryList = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setActivityList,
  setSelectedYear,
  setActivitySummaryList,
  reset,
} = activitySlice.actions;

export const getActivities = (state: RootState) => state.activity.activityList;
export const getSelectedYear = (state: RootState) =>
  state.activity.selectedYear;
export const getActivitySummaries = (state: RootState) =>
  state.activity.activitySummaryList;

export default activitySlice.reducer;
