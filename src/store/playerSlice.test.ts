import { describe, it, expect } from 'vitest'
import playerReducer, {
  setSelectedPlayer,
  selectSelectedPlayer,
  selectAvailableGolfers,
} from './playerSlice'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import type { Golfer } from './playerSlice'

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      player: playerReducer,
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
  it('has null selectedPlayer by default', () => {
    const store = makeStore()
    expect(selectSelectedPlayer(store.getState() as TestState)).toBeNull()
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

  it('sets the selected player via setSelectedPlayer action', () => {
    const store = makeStore()
    store.dispatch(setSelectedPlayer(sampleGolfer))
    expect(selectSelectedPlayer(store.getState() as TestState)).toEqual(sampleGolfer)
  })

  it('clears the selected player when null is dispatched', () => {
    const store = makeStore()
    store.dispatch(setSelectedPlayer(sampleGolfer))
    store.dispatch(setSelectedPlayer(null))
    expect(selectSelectedPlayer(store.getState() as TestState)).toBeNull()
  })

  describe('reducer', () => {
    it('returns initial state for unknown action', () => {
      const state = playerReducer(undefined, { type: '@@init' })
      expect(state.selectedPlayer).toBeNull()
      expect(state.availableGolfers.length).toBeGreaterThan(0)
    })
  })
})
