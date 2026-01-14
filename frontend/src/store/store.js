import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import journalReducer from './journalSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    journal: journalReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['tasks/fetchAnalytics/fulfilled'],
      },
    }),
});

export default store;
