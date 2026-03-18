import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import playersData from '../data/players.json'

export interface SpecialAbility {
  id: string
  name: string
  effect: string
}

export interface PlayerUI {
  primaryColor: string
  accentColor: string
  icon: string
  hexTheme: string
}

export interface PlayerStats {
  power: number
  accuracy: number
  recovery: number
}

export interface Golfer {
  id: string
  name: string
  initials: string
  archetype: string
  bio: string
  ui: PlayerUI
  stats: PlayerStats
  specialAbilities: SpecialAbility[]
}

interface PlayerState {
  selectedPlayer: Golfer | null
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
  selectedPlayer: null,
  availableGolfers: playersData.players.map((p) => ({
    ...p,
    initials: computeInitials(p.name),
  })),
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
