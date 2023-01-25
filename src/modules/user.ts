import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';
import { UserData } from 'types';

export interface userState {
  user: UserData | null;
  selectedUser: UserData | null;
}

const initialState: userState = {
  user: null,
  selectedUser: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.user = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<UserData | null>) => {
      state.selectedUser = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setUser, setSelectedUser, reset } = userSlice.actions;
export const getUser = (state: RootState) => state.user.user;
export const getSelectedUser = (state: RootState) => state.user.selectedUser;
export default userSlice.reducer;
