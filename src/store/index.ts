import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer from './deckSlice'
import shotReducer from './shotSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    player: playerReducer,
    deck: deckReducer,
    shot: shotReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
