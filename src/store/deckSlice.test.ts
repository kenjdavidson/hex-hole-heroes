import { describe, it, expect } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './apiSlice'
import playerReducer from './playerSlice'
import deckReducer, {
  selectAllClubs,
  selectDeckVersion,
  selectClubsByType,
} from './deckSlice'
import shotReducer from './shotSlice'

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

describe('deckSlice', () => {
  it('loads the correct deck version', () => {
    const store = makeStore()
    expect(selectDeckVersion(store.getState() as TestState)).toBe('1.0.0')
  })

  it('loads exactly 14 clubs from deck.json', () => {
    const store = makeStore()
    expect(selectAllClubs(store.getState() as TestState)).toHaveLength(14)
  })

  it('all clubs have required fields', () => {
    const store = makeStore()
    const clubs = selectAllClubs(store.getState() as TestState)
    clubs.forEach((club) => {
      expect(club.id).toBeTruthy()
      expect(club.name).toBeTruthy()
      expect(['Wood', 'Iron', 'Wedge', 'Putter']).toContain(club.type)
      expect(club.dist).toHaveLength(2)
      expect(club.dist[0]).toBeGreaterThan(0)
      expect(club.dist[1]).toBeGreaterThanOrEqual(club.dist[0])
      expect(club.scatter).toBeGreaterThanOrEqual(0)
    })
  })

  it('includes the Driver as the first club', () => {
    const store = makeStore()
    const clubs = selectAllClubs(store.getState() as TestState)
    expect(clubs[0].id).toBe('dr')
    expect(clubs[0].name).toBe('Driver')
    expect(clubs[0].type).toBe('Wood')
  })

  it('includes the Putter as the last club', () => {
    const store = makeStore()
    const clubs = selectAllClubs(store.getState() as TestState)
    const last = clubs[clubs.length - 1]
    expect(last.id).toBe('pt')
    expect(last.type).toBe('Putter')
  })

  describe('selectClubsByType', () => {
    it('returns only Wood clubs', () => {
      const store = makeStore()
      const state = store.getState() as TestState
      const woods = selectClubsByType('Wood')(state)
      expect(woods).toHaveLength(3)
      woods.forEach((c) => expect(c.type).toBe('Wood'))
    })

    it('returns only Iron clubs', () => {
      const store = makeStore()
      const state = store.getState() as TestState
      const irons = selectClubsByType('Iron')(state)
      expect(irons).toHaveLength(7)
      irons.forEach((c) => expect(c.type).toBe('Iron'))
    })

    it('returns only Wedge clubs', () => {
      const store = makeStore()
      const state = store.getState() as TestState
      const wedges = selectClubsByType('Wedge')(state)
      expect(wedges).toHaveLength(3)
      wedges.forEach((c) => expect(c.type).toBe('Wedge'))
    })

    it('returns only Putter clubs', () => {
      const store = makeStore()
      const state = store.getState() as TestState
      const putters = selectClubsByType('Putter')(state)
      expect(putters).toHaveLength(1)
      expect(putters[0].id).toBe('pt')
    })
  })

  describe('reducer', () => {
    it('returns initial state for unknown action', () => {
      const state = deckReducer(undefined, { type: '@@init' })
      expect(state.version).toBe('1.0.0')
      expect(state.clubs.length).toBe(14)
    })
  })
})
