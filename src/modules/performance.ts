import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from './index';
import { PerformanceData } from 'types/types';

export interface PerformanceState {
    performanceList: Array<PerformanceData[]>
};

const initialState: PerformanceState = {
    performanceList: []
}

export const performanceSlice = createSlice({
    name: 'performance',
    initialState,
    reducers: {
        setPerformanceList: (state, action: PayloadAction<Array<PerformanceData[]>>) => {
            state.performanceList = action.payload;
        }
    }
})

export const { setPerformanceList } = performanceSlice.actions;
export const getPerformances = (state: RootState) => state.performance.performanceList;
export default performanceSlice.reducer;