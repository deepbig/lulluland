import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { ActivityData } from 'types';

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
        },
        reset: () => initialState,
    }
})

export const { setActivityList, reset } = activitySlice.actions;

export const getActivities = (state: RootState) => state.activity.activityList;

export default activitySlice.reducer;