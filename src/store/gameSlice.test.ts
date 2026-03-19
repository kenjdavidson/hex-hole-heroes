import { beforeEach, describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer from './deckSlice'
import shotReducer from './shotSlice'
import gameReducer, {
  startGame,
  clearGame,
  selectActiveGame,
  selectHasActiveGame,
} from './gameSlice'
import type { Golfer } from '../types/player'
import type { Club } from '../types/club'

function makeStore() {
  return configureStore({
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
}

type TestState = ReturnType<ReturnType<typeof makeStore>['getState']>

const sampleGolfer: Golfer = {
  id: 'ace-omalley',
  name: "'Ace' O'Malley",
  initials: 'ACE',
  archetype: 'The Veteran',
  bio: "He's played every course twice.",
  ui: {
    primaryColor: '#2D5A27',
    accentColor: '#F0EAD6',
    icon: 'ace_omalley.png',
    hexTheme: 'forest-green',
  },
  stats: { power: 2, accuracy: 5, recovery: 4 },
  specialAbilities: [
    {
      id: 'old-school',
      name: 'Old School Lore',
      effect: 'Negate one Wind modifier per hole.',
    },
  ],
}

const sampleClub: Club = {
  id: 'dr',
  name: 'Driver',
  type: 'Wood',
  dist: [8, 12],
  scatter: 1,
  ability: null,
}

beforeEach(() => {
  localStorage.clear()
})

describe('gameSlice', () => {
  describe('initial state', () => {
    it('has null activeGame by default', () => {
      const store = makeStore()
      expect(selectActiveGame(store.getState() as TestState)).toBeNull()
    })

    it('selectHasActiveGame returns false when no game', () => {
      const store = makeStore()
      expect(selectHasActiveGame(store.getState() as TestState)).toBe(false)
    })
  })

  describe('startGame action', () => {
    it('creates a game with the provided golfer, clubs, and holes', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 9 }),
      )
      const game = selectActiveGame(store.getState() as TestState)
      expect(game).not.toBeNull()
      expect(game?.golfer).toEqual(sampleGolfer)
      expect(game?.clubs).toEqual([sampleClub])
      expect(game?.holes).toBe(9)
    })

    it('assigns a numeric id to the game', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 9 }),
      )
      const game = selectActiveGame(store.getState() as TestState)
      expect(typeof game?.id).toBe('number')
    })

    it('creates a game with 18 holes', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 18 }),
      )
      expect(selectActiveGame(store.getState() as TestState)?.holes).toBe(18)
    })

    it('selectHasActiveGame returns true after startGame', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 9 }),
      )
      expect(selectHasActiveGame(store.getState() as TestState)).toBe(true)
    })

    it('replaces an existing game when called again', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 9 }),
      )
      const firstId = selectActiveGame(store.getState() as TestState)?.id
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 18 }),
      )
      const secondGame = selectActiveGame(store.getState() as TestState)
      expect(secondGame?.holes).toBe(18)
      // IDs may differ (Date.now) - just ensure a game exists
      expect(secondGame?.id).toBeDefined()
      // In fast tests, ids may be equal; just verify an active game is present
      expect(selectHasActiveGame(store.getState() as TestState)).toBe(true)
      void firstId // suppress unused-var warning
    })
  })

  describe('clearGame action', () => {
    it('sets activeGame to null', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 9 }),
      )
      store.dispatch(clearGame())
      expect(selectActiveGame(store.getState() as TestState)).toBeNull()
    })

    it('selectHasActiveGame returns false after clearGame', () => {
      const store = makeStore()
      store.dispatch(
        startGame({ golfer: sampleGolfer, clubs: [sampleClub], holes: 9 }),
      )
      store.dispatch(clearGame())
      expect(selectHasActiveGame(store.getState() as TestState)).toBe(false)
    })
  })

  describe('reducer', () => {
    it('returns initial state for unknown action', () => {
      const state = gameReducer(undefined, { type: '@@init' })
      expect(state.activeGame).toBeNull()
    })
  })
})
