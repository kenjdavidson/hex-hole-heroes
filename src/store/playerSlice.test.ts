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

describe('playerSlice', () => {
  it('has null selectedPlayer by default', () => {
    const store = makeStore()
    expect(selectSelectedPlayer(store.getState() as TestState)).toBeNull()
  })

  it('has a default list of available golfers', () => {
    const store = makeStore()
    const golfers = selectAvailableGolfers(store.getState() as TestState)
    expect(golfers.length).toBeGreaterThan(0)
  })

  it('sets the selected player via setSelectedPlayer action', () => {
    const store = makeStore()
    const golfer: Golfer = { id: '1', name: 'Player 1', initials: 'P1' }
    store.dispatch(setSelectedPlayer(golfer))
    expect(selectSelectedPlayer(store.getState() as TestState)).toEqual(golfer)
  })

  it('clears the selected player when null is dispatched', () => {
    const store = makeStore()
    const golfer: Golfer = { id: '1', name: 'Player 1', initials: 'P1' }
    store.dispatch(setSelectedPlayer(golfer))
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
