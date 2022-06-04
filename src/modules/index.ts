import { configureStore } from '@reduxjs/toolkit';
import activityReducer from './activity';
import categoryReducer from './category';
import performanceReducer from './performance';
import backdropReducer from './backdrop';
import userReducer from './user';

export const store = configureStore({
    reducer: {
        activity: activityReducer,
        category: categoryReducer,
        performance: performanceReducer,
        backdrop: backdropReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;