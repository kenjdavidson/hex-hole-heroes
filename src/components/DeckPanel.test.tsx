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

  it('renders all four club type section headings', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.getByText('Woods')).toBeInTheDocument()
    expect(screen.getByText('Irons')).toBeInTheDocument()
    expect(screen.getByText('Wedges')).toBeInTheDocument()
    expect(screen.getByText('Putters')).toBeInTheDocument()
  })

  it('renders all 14 club cards', () => {
    renderWithStore(<DeckPanel />)
    const cards = screen.getAllByRole('button')
    expect(cards).toHaveLength(14)
  })

  it('renders the Driver card', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.getByText('Driver')).toBeInTheDocument()
  })

  it('renders the Putter card', () => {
    renderWithStore(<DeckPanel />)
    expect(screen.getAllByText('Putter').length).toBeGreaterThan(0)
  })
})
