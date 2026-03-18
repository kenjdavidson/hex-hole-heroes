import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import playersData from '../data/players.json'
import type { Golfer } from '../types/player'

export type { Golfer, SpecialAbility, PlayerUI, PlayerStats } from '../types/player'

interface PlayerState {
  selectedGolfer: Golfer | null
  availableGolfers: Golfer[]
}

function computeInitials(name: string): string {
  const match = name.match(/'([^']+)'/)
  if (match) return match[1].slice(0, 3).toUpperCase()
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}

const initialState: PlayerState = {
  selectedGolfer: null,
  availableGolfers: playersData.players.map((p) => ({
    ...p,
    initials: computeInitials(p.name),
  })),
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setSelectedGolfer(state, action: PayloadAction<Golfer | null>) {
      state.selectedGolfer = action.payload
    },
  },
})

export const { setSelectedGolfer } = playerSlice.actions

export const selectSelectedGolfer = (state: RootState) =>
  state.player.selectedGolfer

export const selectAvailableGolfers = (state: RootState) =>
  state.player.availableGolfers

export default playerSlice.reducer
