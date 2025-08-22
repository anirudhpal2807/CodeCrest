import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.error', 'payload.config', 'payload.request'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.error']
      }
    })
});

