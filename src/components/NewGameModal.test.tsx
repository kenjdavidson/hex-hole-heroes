import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import theme from '../theme'
import NewGameModal from './NewGameModal'

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  })
}

function renderModal(open = true, onClose = () => {}) {
  const store = makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <NewGameModal open={open} onClose={onClose} />
        </ThemeProvider>
      </Provider>,
    ),
  }
}

describe('NewGameModal', () => {
  it('renders the dialog title when open', () => {
    renderModal()
    expect(screen.getByText('New Game — Choose Your Golfer')).toBeInTheDocument()
  })

  it('renders all 6 player cards', () => {
    renderModal()
    expect(screen.getByLabelText("Select 'Ace' O'Malley")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Boomer' Benson")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Calamity' Jane")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Dimples' Davis")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Evie' Eagle")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Flop' Ferguson")).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderModal(false)
    expect(screen.queryByText('New Game — Choose Your Golfer')).not.toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    let closed = false
    renderModal(true, () => { closed = true })
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('close new game dialog'))
    expect(closed).toBe(true)
  })

  it('dispatches selected player and calls onClose when a card is clicked', async () => {
    let closed = false
    const { store } = renderModal(true, () => { closed = true })
    const user = userEvent.setup()
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    expect(closed).toBe(true)
    expect(store.getState().player.selectedPlayer?.id).toBe('ace-omalley')
  })
})
