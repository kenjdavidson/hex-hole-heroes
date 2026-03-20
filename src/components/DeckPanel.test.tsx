import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import deckReducer from '../store/deckSlice'
import shotReducer from '../store/shotSlice'
import DeckPanel from './DeckPanel'

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

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={makeStore()}>{ui}</Provider>)
}

describe('DeckPanel', () => {
  it('renders all 14 club cards in the bag hand', () => {
    renderWithStore(<DeckPanel />)
    const stubs = screen.getAllByLabelText(/distance .+ hexes/)
    expect(stubs).toHaveLength(14)
  })

  it('does not render type section headings', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.queryByText('Woods')).not.toBeInTheDocument()
    expect(screen.queryByText('Irons')).not.toBeInTheDocument()
    expect(screen.queryByText('Wedges')).not.toBeInTheDocument()
    expect(screen.queryByText('Putters')).not.toBeInTheDocument()
  })

  it('renders the Driver stub', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.getByLabelText(/Driver, Wood/)).toBeInTheDocument()
  })

  it('renders the Putter stub', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.getByLabelText(/Putter, Putter/)).toBeInTheDocument()
  })

  it('removes the selected club from the bag when clicked', async () => {
    const user = userEvent.setup()
    renderWithStore(<DeckPanel />)
    await user.click(screen.getByLabelText(/Driver, Wood/))
    expect(screen.queryByLabelText(/Driver, Wood/)).not.toBeInTheDocument()
    expect(screen.getAllByLabelText(/distance .+ hexes/)).toHaveLength(13)
  })

  it('selecting a different club returns the previous one to the bag', async () => {
    const user = userEvent.setup()
    renderWithStore(<DeckPanel />)
    await user.click(screen.getByLabelText(/Driver, Wood/))
    // Driver is gone; now select the Putter
    await user.click(screen.getByLabelText(/Putter, Putter/))
    // Driver returns; Putter is gone
    expect(screen.getByLabelText(/Driver, Wood/)).toBeInTheDocument()
    expect(screen.queryByLabelText(/Putter, Putter/)).not.toBeInTheDocument()
    expect(screen.getAllByLabelText(/distance .+ hexes/)).toHaveLength(13)
  })
})
