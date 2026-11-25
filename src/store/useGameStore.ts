import { create } from 'zustand'
import type { Golfer } from '../types/player'

export interface GameStoreState {
  selectedGolfer: Golfer | null
  activeGolfer: Golfer | null
  setSelectedGolfer: (golfer: Golfer | null) => void
  setActiveGolfer: (golfer: Golfer | null) => void
}

export const useGameStore = create<GameStoreState>((set) => ({
  selectedGolfer: null,
  activeGolfer: null,
  setSelectedGolfer: (golfer) =>
    set((state) => ({
      selectedGolfer: golfer,
      activeGolfer: golfer ?? state.activeGolfer,
    })),
  setActiveGolfer: (golfer) => set({ activeGolfer: golfer }),
}))

export const selectActiveGolfer = (state: GameStoreState) => state.activeGolfer

export const selectSelectedGolferState = (state: GameStoreState) => state.selectedGolfer
