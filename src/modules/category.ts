import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { CategoryData } from 'types';

export interface categoryState {
    category: CategoryData;
};

const initialState: categoryState = {
    category: null
};

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategory: (state, action: PayloadAction<CategoryData>) => {
            state.category = action.payload;
        }
    }
})

export const { setCategory } = categorySlice.actions;
export const getCategory = (state: RootState) => state.category.category;
export default categorySlice.reducer;