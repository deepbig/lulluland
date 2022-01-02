import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import activityReducer from './activity';

export const store = configureStore({
    reducer: {
        activity: activityReducer
    },
    middleware: [
        ...getDefaultMiddleware({
            serializableCheck: false
        }),
    ],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;