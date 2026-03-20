import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import type { Game } from '../../types/game'
import type { Golfer } from '../../types/player'
import type { Club } from '../../types/club'

export type { Game } from '../../types/game'

export const GAME_STORAGE_KEY = 'hex-hole-heroes:activeGame'

export interface StartGamePayload {
  golfer: Golfer
  clubs: Club[]
  holes: number
}

interface GameState {
  activeGame: Game | null
}

function loadGameFromStorage(): Game | null {
  try {
    const serialized = localStorage.getItem(GAME_STORAGE_KEY)
    if (!serialized) return null
    return JSON.parse(serialized) as Game
  } catch {
    return null
  }
}

const initialState: GameState = {
  activeGame: loadGameFromStorage(),
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state, action: PayloadAction<StartGamePayload>) {
      const { golfer, clubs, holes } = action.payload
      state.activeGame = {
        id: Date.now(),
        golfer,
        clubs,
        holes,
      }
    },
    clearGame(state) {
      state.activeGame = null
    },
  },
})

export const { startGame, clearGame } = gameSlice.actions

export const selectActiveGame = (state: RootState) => state.game.activeGame

export const selectHasActiveGame = (state: RootState) =>
  state.game.activeGame !== null

export default gameSlice.reducer
