import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer from './deckSlice'
import shotReducer, {
  selectClub,
  recordShot,
  clearShot,
  selectSelectedClubId,
  selectLastShot,
} from './shotSlice'
import type { ShotResult } from '../types/shot'

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      player: playerReducer,
      deck: deckReducer,
      shot: shotReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  })
}

type TestState = ReturnType<ReturnType<typeof makeStore>['getState']>

const sampleShot: ShotResult = {
  clubId: 'dr',
  powerRoll: 9,
  scatterRoll: 11,
  powerOffset: 2,
  scatterOffset: 2,
}

describe('shotSlice', () => {
  describe('initial state', () => {
    it('has no selected club on init', () => {
      const store = makeStore()
      expect(selectSelectedClubId(store.getState() as TestState)).toBeNull()
    })

    it('has no last shot on init', () => {
      const store = makeStore()
      expect(selectLastShot(store.getState() as TestState)).toBeNull()
    })
  })

  describe('selectClub action', () => {
    it('sets the selected club ID', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      expect(selectSelectedClubId(store.getState() as TestState)).toBe('dr')
    })

    it('clears selected club when dispatched with null', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      store.dispatch(selectClub(null))
      expect(selectSelectedClubId(store.getState() as TestState)).toBeNull()
    })

    it('clears the last shot when a new club is selected', () => {
      const store = makeStore()
      store.dispatch(recordShot(sampleShot))
      store.dispatch(selectClub('5i'))
      expect(selectLastShot(store.getState() as TestState)).toBeNull()
    })

    it('clears the last shot when club is deselected (null)', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      store.dispatch(recordShot(sampleShot))
      store.dispatch(selectClub(null))
      expect(selectLastShot(store.getState() as TestState)).toBeNull()
    })
  })

  describe('recordShot action', () => {
    it('stores the shot result', () => {
      const store = makeStore()
      store.dispatch(recordShot(sampleShot))
      expect(selectLastShot(store.getState() as TestState)).toEqual(sampleShot)
    })

    it('overwrites a previous shot', () => {
      const store = makeStore()
      store.dispatch(recordShot(sampleShot))
      const newShot: ShotResult = { ...sampleShot, powerRoll: 12, powerOffset: 6 }
      store.dispatch(recordShot(newShot))
      expect(selectLastShot(store.getState() as TestState)).toEqual(newShot)
    })
  })

  describe('clearShot action', () => {
    it('clears the last shot', () => {
      const store = makeStore()
      store.dispatch(recordShot(sampleShot))
      store.dispatch(clearShot())
      expect(selectLastShot(store.getState() as TestState)).toBeNull()
    })

    it('does not change the selected club', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      store.dispatch(recordShot(sampleShot))
      store.dispatch(clearShot())
      expect(selectSelectedClubId(store.getState() as TestState)).toBe('dr')
    })
  })

  describe('reducer', () => {
    it('returns initial state for unknown action', () => {
      const state = shotReducer(undefined, { type: '@@init' })
      expect(state.selectedClubId).toBeNull()
      expect(state.lastShot).toBeNull()
    })
  })
})
