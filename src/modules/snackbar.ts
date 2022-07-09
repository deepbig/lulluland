import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SnackbarData } from 'types';
import { RootState } from './index';

export interface SnackbarState {
    snackbar: SnackbarData,
}

const initialState: SnackbarState = {
    snackbar: {
        open: false,
        severity: 'info',
        message: '',
    } as SnackbarData,
}

export const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        setSnackbar: (state, action: PayloadAction<SnackbarData>) => {
            state.snackbar = action.payload;
        },
        setOpen: (state, action: PayloadAction<boolean>) => {
            state.snackbar.open = action.payload;
        },
        reset: () => initialState,
    }
})

export const { setSnackbar, setOpen, reset } = snackbarSlice.actions;
export const getSnackbar = (state: RootState) => state.snackbar.snackbar;
export default snackbarSlice.reducer;