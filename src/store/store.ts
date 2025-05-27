// lib/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '@/api/apiSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add more reducers here if needed
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

// Type helpers
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
