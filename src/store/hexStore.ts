import { create } from 'zustand'

export interface HexStoreState {
  ballQ: number
  ballR: number
  setBallPosition: (q: number, r: number) => void
}

export const useGameStore = create<HexStoreState>((set) => ({
  ballQ: 0,
  ballR: 0,
  setBallPosition: (q, r) => set({ ballQ: q, ballR: r }),
}))
