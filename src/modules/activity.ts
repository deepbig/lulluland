import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { ActivityData } from 'types';

export interface ActivityState {
    activityList: ActivityData[];
    selectedYear: number;
}

const initialState: ActivityState = {
    activityList: [],
    selectedYear: 0,
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
        reset: () => initialState,
    }
})

export const { setActivityList, setSelectedYear, reset } = activitySlice.actions;

export const getActivities = (state: RootState) => state.activity.activityList;
export const getSelectedYear  = (state: RootState) => state.activity.selectedYear;

export default activitySlice.reducer;