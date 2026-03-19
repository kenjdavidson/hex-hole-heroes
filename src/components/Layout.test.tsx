import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import deckReducer from '../store/deckSlice'
import shotReducer from '../store/shotSlice'
import theme from '../theme'
import Layout from './Layout'

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

function renderLayout() {
  const store = makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <ThemeProvider theme={theme}>
            <Layout />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    ),
  }
}

describe('Layout', () => {
  it('renders the app title', () => {
    renderLayout()
    expect(screen.getByText('Hex Hole Heroes')).toBeInTheDocument()
  })

  it('renders the selected player hex icon with "?" when no player is selected', () => {
    renderLayout()
    expect(screen.getByLabelText('selected player icon')).toBeInTheDocument()
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders the hamburger menu button', () => {
    renderLayout()
    expect(screen.getByLabelText('open menu')).toBeInTheDocument()
  })

  it('renders the board panel', () => {
    renderLayout()
    expect(screen.getByLabelText('board panel')).toBeInTheDocument()
  })

  it('renders the scorecard panel with the club bag', () => {
    renderLayout()
    expect(screen.getByLabelText('scorecard panel')).toBeInTheDocument()
    expect(screen.getByText('Your Bag')).toBeInTheDocument()
  })

  it('renders the status bar', () => {
    renderLayout()
    expect(screen.getByLabelText('status bar')).toBeInTheDocument()
    expect(screen.getByText(/No golfer selected/i)).toBeInTheDocument()
  })

  it('opens the hamburger menu when clicked', async () => {
    renderLayout()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    expect(screen.getByText('New Game')).toBeInTheDocument()
  })

  it('opens the New Game modal when "New Game" is clicked', async () => {
    renderLayout()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    await user.click(screen.getByText('New Game'))
    expect(
      screen.getByText('New Game — Choose Your Golfer'),
    ).toBeInTheDocument()
    expect(screen.getByText("'Ace' O'Malley")).toBeInTheDocument()
    expect(screen.getByText("'Boomer' Benson")).toBeInTheDocument()
  })

  it('updates selected player and status bar when a golfer card is clicked', async () => {
    renderLayout()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    await user.click(screen.getByText('New Game'))
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    expect(screen.getByLabelText('selected player icon')).toHaveTextContent('ACE')
    expect(screen.getByText(/Active golfer: 'Ace' O'Malley/i)).toBeInTheDocument()
  })

  it('closes the modal after selecting a golfer', async () => {
    renderLayout()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    await user.click(screen.getByText('New Game'))
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    await waitFor(() => {
      expect(
        screen.queryByText('New Game — Choose Your Golfer'),
      ).not.toBeInTheDocument()
    })
  })
})
