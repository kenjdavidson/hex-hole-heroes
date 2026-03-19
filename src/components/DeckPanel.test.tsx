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

  it('marks the Driver as selected when clicked', async () => {
    const user = userEvent.setup()
    renderWithStore(<DeckPanel />)
    const driver = screen.getByLabelText(/Driver, Wood/)
    await user.click(driver)
    expect(driver).toHaveAttribute('aria-pressed', 'true')
  })

  it('deselects a club when it is clicked a second time', async () => {
    const user = userEvent.setup()
    renderWithStore(<DeckPanel />)
    const driver = screen.getByLabelText(/Driver, Wood/)
    await user.click(driver)
    await user.click(driver)
    expect(driver).toHaveAttribute('aria-pressed', 'false')
  })

  it('only one club is selected at a time', async () => {
    const user = userEvent.setup()
    renderWithStore(<DeckPanel />)
    const driver = screen.getByLabelText(/Driver, Wood/)
    const putter = screen.getByLabelText(/Putter, Putter/)
    await user.click(driver)
    await user.click(putter)
    expect(driver).toHaveAttribute('aria-pressed', 'false')
    expect(putter).toHaveAttribute('aria-pressed', 'true')
  })
})
