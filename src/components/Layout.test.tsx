import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import deckReducer from '../store/deckSlice'
import shotReducer from '../store/shotSlice'
import gameReducer from '../store/game'
import theme from '../theme'
import Layout from './Layout'

function makeStore() {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      player: playerReducer,
      deck: deckReducer,
      shot: shotReducer,
      game: gameReducer,
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

/** Render Layout inside a minimal route tree so navigation actually works. */
function renderLayoutWithRoutes(initialPath = '/') {
  const store = makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialPath]}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={null} />
                <Route
                  path="new-game"
                  element={<div>New Game Page</div>}
                />
              </Route>
            </Routes>
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

  it('renders a GitHub link button', () => {
    renderLayout()
    const link = screen.getByRole('link', { name: /view on github/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://github.com/kenjdavidson/hex-hole-heroes')
    expect(link).toHaveAttribute('target', '_blank')
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
    expect(screen.getByLabelText('shot overlay')).toBeInTheDocument()
  })

  it('hides the scorecard panel on the /new-game route', () => {
    renderLayoutWithRoutes('/new-game')
    expect(screen.queryByLabelText('scorecard panel')).not.toBeInTheDocument()
  })

  it('shows the scorecard panel on the home route', () => {
    renderLayoutWithRoutes('/')
    expect(screen.getByLabelText('scorecard panel')).toBeInTheDocument()
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

  it('navigates to /new-game when "New Game" is clicked', async () => {
    renderLayoutWithRoutes('/')
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    await user.click(screen.getByText('New Game'))
    expect(screen.getByText('New Game Page')).toBeInTheDocument()
  })
})
