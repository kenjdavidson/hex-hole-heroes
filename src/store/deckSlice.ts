import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './index'
import deckData from '../data/deck.json'
import type { Club, ClubType, Deck } from '../types/club'

export type { Club, ClubType, Deck } from '../types/club'

interface DeckState {
  version: string
  clubs: Club[]
}

const initialState: DeckState = {
  version: (deckData as Deck).version,
  clubs: (deckData as Deck).starting_bag,
}

const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {},
})

export const selectDeckVersion = (state: RootState) => state.deck.version

export const selectAllClubs = (state: RootState) => state.deck.clubs

export const selectClubsByType =
  (type: ClubType) =>
  (state: RootState): Club[] =>
    state.deck.clubs.filter((c) => c.type === type)

export default deckSlice.reducer
