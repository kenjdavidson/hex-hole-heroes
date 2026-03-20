import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer from './deckSlice'
import shotReducer from './shotSlice'
import gameReducer from './gameSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    player: playerReducer,
    deck: deckReducer,
    shot: shotReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

let lastActiveGame: string | null = null
store.subscribe(() => {
  try {
    const { activeGame } = store.getState().game
    const serialized = activeGame ? JSON.stringify(activeGame) : null
    if (serialized === lastActiveGame) return
    lastActiveGame = serialized
    if (serialized) {
      localStorage.setItem('hex-hole-heroes:activeGame', serialized)
    } else {
      localStorage.removeItem('hex-hole-heroes:activeGame')
    }
  } catch {
    // ignore write errors (e.g. private browsing quota)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
