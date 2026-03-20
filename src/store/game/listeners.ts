import { createListenerMiddleware } from '@reduxjs/toolkit'
import type { Game } from '../../types/game'
import { startGame, clearGame, GAME_STORAGE_KEY } from './slice'

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
