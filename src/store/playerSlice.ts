import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'

export interface Golfer {
  id: string
  name: string
  initials: string
}

interface PlayerState {
  selectedPlayer: Golfer | null
  availableGolfers: Golfer[]
}

const initialState: PlayerState = {
  selectedPlayer: null,
  availableGolfers: [
    { id: '1', name: 'Player 1', initials: 'P1' },
    { id: '2', name: 'Player 2', initials: 'P2' },
    { id: '3', name: 'Player 3', initials: 'P3' },
    { id: '4', name: 'Player 4', initials: 'P4' },
  ],
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setSelectedPlayer(state, action: PayloadAction<Golfer | null>) {
      state.selectedPlayer = action.payload
    },
  },
})

export const { setSelectedPlayer } = playerSlice.actions

export const selectSelectedPlayer = (state: RootState) =>
  state.player.selectedPlayer

export const selectAvailableGolfers = (state: RootState) =>
  state.player.availableGolfers

export default playerSlice.reducer
