import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import deckReducer from '../store/deckSlice'
import DeckPanel from './DeckPanel'

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      player: playerReducer,
      deck: deckReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  })
}

function renderWithStore(ui: React.ReactElement) {
  return render(<Provider store={makeStore()}>{ui}</Provider>)
}

describe('DeckPanel', () => {
  it('renders the "Your Bag" heading', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.getByText('Your Bag')).toBeInTheDocument()
  })

  it('renders all 14 club stubs in a single row', () => {
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
})
