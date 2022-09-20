import { configureStore } from '@reduxjs/toolkit';
import activityReducer from './activity';
import performanceReducer from './performance';
import backdropReducer from './backdrop';
import userReducer from './user';
import snackbarReducer from './snackbar';
import assetReducer from './asset';
import stockReducer from './stock';
import stockHistoryReducer from './stockHistory';

export const store = configureStore({
  reducer: {
    activity: activityReducer,
    performance: performanceReducer,
    backdrop: backdropReducer,
    user: userReducer,
    snackbar: snackbarReducer,
    asset: assetReducer,
    stock: stockReducer,
    stockHistory: stockHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
