import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import deckReducer from '../store/deckSlice'
import shotReducer, { selectClub } from '../store/shotSlice'
import ShotOverlay from './ShotOverlay'

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

function renderWithStore(store = makeStore()) {
  return {
    store,
    ...render(
      <Provider store={store}>
        <ShotOverlay />
      </Provider>,
    ),
  }
}

describe('ShotOverlay', () => {
  it('renders the shot overlay region even when no club is selected', () => {
    renderWithStore()
    expect(screen.getByRole('region', { name: 'shot overlay' })).toBeInTheDocument()
  })

  it('renders a placeholder when no club is selected', () => {
    renderWithStore()
    expect(screen.getByLabelText('club placeholder')).toBeInTheDocument()
    expect(screen.getByText(/Select a club from your bag/)).toBeInTheDocument()
  })

  it('does not show Roll Dice or Change buttons when no club is selected', () => {
    renderWithStore()
    expect(screen.queryByRole('button', { name: 'roll dice' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'change club' })).not.toBeInTheDocument()
  })

  describe('with a club selected', () => {
    it('renders the overlay when a club is selected', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      expect(screen.getByRole('region', { name: 'shot overlay' })).toBeInTheDocument()
    })

    it('shows the selected club name', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      expect(screen.getByText('Driver')).toBeInTheDocument()
    })

    it('shows club type and distance info', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      expect(screen.getByText(/Wood/)).toBeInTheDocument()
      expect(screen.getByText('12–15')).toBeInTheDocument()
      expect(screen.getAllByText('hex').length).toBeGreaterThan(0)
    })

    it('shows scatter info for clubs with scatter > 0', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      expect(screen.getByText(/scatter:/)).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('does not show scatter info for clubs with scatter === 0', () => {
      const store = makeStore()
      store.dispatch(selectClub('7i'))
      renderWithStore(store)
      expect(screen.queryByText(/scatter/)).not.toBeInTheDocument()
    })

    it('shows a "Roll Dice" button before rolling', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      expect(screen.getByRole('button', { name: 'roll dice' })).toBeInTheDocument()
    })

    it('shows a "Change" button to deselect club', () => {
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      expect(screen.getByRole('button', { name: 'change club' })).toBeInTheDocument()
    })

    it('dispatches selectClub(null) when "Change" is clicked', async () => {
      const user = userEvent.setup()
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      await user.click(screen.getByRole('button', { name: 'change club' }))
      expect(store.getState().shot.selectedClubId).toBeNull()
    })
  })

  describe('after rolling dice', () => {
    beforeEach(() => {
      // Fix Math.random so dice rolls are deterministic
      // Math.random() = 0.5 → d6 = floor(0.5*6)+1 = 4 each → 2d6 = 8
      // Math.random() = 0.5 → d12 = floor(0.5*12)+1 = 7
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('shows the power roll after clicking "Roll Dice"', async () => {
      const user = userEvent.setup()
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      await user.click(screen.getByRole('button', { name: 'roll dice' }))
      // Power roll label
      expect(screen.getByText('Power (2d6)')).toBeInTheDocument()
      // Dice value (2d6 with random 0.5: 4+4=8)
      expect(screen.getByText('8')).toBeInTheDocument()
    })

    it('shows the scatter roll for clubs with scatter > 0', async () => {
      const user = userEvent.setup()
      const store = makeStore()
      store.dispatch(selectClub('dr')) // Driver has scatter 2
      renderWithStore(store)
      await user.click(screen.getByRole('button', { name: 'roll dice' }))
      expect(screen.getByText('Scatter (d12)')).toBeInTheDocument()
    })

    it('does not show the scatter roll for no-scatter clubs', async () => {
      const user = userEvent.setup()
      const store = makeStore()
      store.dispatch(selectClub('7i')) // 7-Iron has scatter 0
      renderWithStore(store)
      await user.click(screen.getByRole('button', { name: 'roll dice' }))
      expect(screen.queryByText('Scatter (d12)')).not.toBeInTheDocument()
    })

    it('shows a power result chip', async () => {
      const user = userEvent.setup()
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      await user.click(screen.getByRole('button', { name: 'roll dice' }))
      expect(screen.getByLabelText('power result')).toBeInTheDocument()
    })

    it('shows a scatter result chip for scatter clubs', async () => {
      const user = userEvent.setup()
      const store = makeStore()
      store.dispatch(selectClub('dr'))
      renderWithStore(store)
      await user.click(screen.getByRole('button', { name: 'roll dice' }))
      expect(screen.getByLabelText('scatter result')).toBeInTheDocument()
    })
  })
})
