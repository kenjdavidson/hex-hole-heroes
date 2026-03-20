import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer from './deckSlice'
import shotReducer from './shotSlice'
import gameReducer, { startGame, clearGame } from './gameSlice'
import type { Game } from '../types/game'

const GAME_STORAGE_KEY = 'hex-hole-heroes:activeGame'

type GameStateSlice = { game: { activeGame: Game | null } }

export const gameListenerMiddleware = createListenerMiddleware()

gameListenerMiddleware.startListening({
  actionCreator: startGame,
  effect: (_action, listenerApi) => {
    try {
      const { activeGame } = (listenerApi.getState() as GameStateSlice).game
      if (activeGame) {
        localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(activeGame))
      }
    } catch {
      // ignore write errors (e.g. private browsing quota)
    }
  },
})

gameListenerMiddleware.startListening({
  actionCreator: clearGame,
  effect: () => {
    try {
      localStorage.removeItem(GAME_STORAGE_KEY)
    } catch {
      // ignore errors
    }
  },
})

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
