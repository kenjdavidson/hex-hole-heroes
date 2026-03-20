import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer from './deckSlice'
import shotReducer from './shotSlice'
import gameReducer from './game/slice'
import { gameListenerMiddleware } from './game/listeners'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    player: playerReducer,
    deck: deckReducer,
    shot: shotReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(gameListenerMiddleware.middleware)
      .concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
