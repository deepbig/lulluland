import { configureStore } from '@reduxjs/toolkit';
import activityReducer from './activity';
import categoryReducer from './category';
import performanceReducer from './performance';

export const store = configureStore({
    reducer: {
        activity: activityReducer,
        category: categoryReducer,
        performance: performanceReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;