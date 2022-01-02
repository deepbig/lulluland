import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { ActivityData } from 'types/types';

export interface ActivityState {
    activityList: ActivityData[];
}

const initialState: ActivityState = {
    activityList: []
};

export const activitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        setActivityList: (state, action: PayloadAction<ActivityData[]>) => {
            state.activityList = action.payload;
        }
    }
})

export const { setActivityList } = activitySlice.actions;

export const getActivities = (state: RootState) => state.activity.activityList;

export default activitySlice.reducer;