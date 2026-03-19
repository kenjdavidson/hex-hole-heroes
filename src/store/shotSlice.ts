import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './index'
import type { ShotResult } from '../types/shot'

export type { ShotResult } from '../types/shot'

interface ShotState {
  /** ID of the currently selected club, or null if none */
  selectedClubId: string | null
  /** Result of the most recent shot, or null if no shot taken yet */
  lastShot: ShotResult | null
}

const initialState: ShotState = {
  selectedClubId: null,
  lastShot: null,
}

const shotSlice = createSlice({
  name: 'shot',
  initialState,
  reducers: {
    /** Select a club by ID. Clears the last shot when a new club is selected. */
    selectClub(state, action: PayloadAction<string | null>) {
      state.selectedClubId = action.payload
      state.lastShot = null
    },
    /** Record the result of a dice roll for the current shot. */
    recordShot(state, action: PayloadAction<ShotResult>) {
      state.lastShot = action.payload
    },
    /** Clear the last shot result without changing the selected club. */
    clearShot(state) {
      state.lastShot = null
    },
  },
})

export const { selectClub, recordShot, clearShot } = shotSlice.actions

export const selectSelectedClubId = (state: RootState) =>
  state.shot.selectedClubId

export const selectLastShot = (state: RootState) => state.shot.lastShot

export default shotSlice.reducer
