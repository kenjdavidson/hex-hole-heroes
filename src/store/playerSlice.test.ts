import { describe, it, expect } from 'vitest'
import playerReducer, {
  setSelectedGolfer,
  selectSelectedGolfer,
  selectAvailableGolfers,
} from './playerSlice'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import deckReducer from './deckSlice'
import type { Golfer } from '../types/player'

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      player: playerReducer,
      deck: deckReducer,
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
    { id: 'old-school', name: 'Old School Lore', effect: 'Negate one Wind modifier per hole.' },
  ],
}

describe('playerSlice', () => {
  it('has null selectedGolfer by default', () => {
    const store = makeStore()
    expect(selectSelectedGolfer(store.getState() as TestState)).toBeNull()
  })

  it('has 6 available golfers loaded from players.json', () => {
    const store = makeStore()
    const golfers = selectAvailableGolfers(store.getState() as TestState)
    expect(golfers).toHaveLength(6)
  })

  it('available golfers have computed initials', () => {
    const store = makeStore()
    const golfers = selectAvailableGolfers(store.getState() as TestState)
    golfers.forEach((g) => {
      expect(g.initials).toBeTruthy()
      expect(g.initials.length).toBeGreaterThan(0)
    })
  })

  it('available golfers include all expected player ids', () => {
    const store = makeStore()
    const ids = selectAvailableGolfers(store.getState() as TestState).map((g) => g.id)
    expect(ids).toContain('ace-omalley')
    expect(ids).toContain('boomer-benson')
    expect(ids).toContain('calamity-jane')
    expect(ids).toContain('dimples-davis')
    expect(ids).toContain('evie-eagle')
    expect(ids).toContain('flop-ferguson')
  })

  it('sets the selected golfer via setSelectedGolfer action', () => {
    const store = makeStore()
    store.dispatch(setSelectedGolfer(sampleGolfer))
    expect(selectSelectedGolfer(store.getState() as TestState)).toEqual(sampleGolfer)
  })

  it('clears the selected golfer when null is dispatched', () => {
    const store = makeStore()
    store.dispatch(setSelectedGolfer(sampleGolfer))
    store.dispatch(setSelectedGolfer(null))
    expect(selectSelectedGolfer(store.getState() as TestState)).toBeNull()
  })

  describe('reducer', () => {
    it('returns initial state for unknown action', () => {
      const state = playerReducer(undefined, { type: '@@init' })
      expect(state.selectedGolfer).toBeNull()
      expect(state.availableGolfers.length).toBeGreaterThan(0)
    })
  })
})
