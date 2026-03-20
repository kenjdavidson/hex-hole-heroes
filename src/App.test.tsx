import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './store/apiSlice'
import playerReducer from './store/playerSlice'
import deckReducer from './store/deckSlice'
import shotReducer from './store/shotSlice'
import gameReducer, { startGame } from './store/gameSlice'
import theme from './theme'
import App from './App'
import type { Golfer } from './types/player'

const sampleGolfer: Golfer = {
  id: 'ace-omalley',
  name: "'Ace' O'Malley",
  initials: 'ACE',
  archetype: 'The Veteran',
  bio: "He's played every course twice.",
  ui: {
    primaryColor: '#2D5A27',
    accentColor: '#F0EAD6',
    icon: 'ace_omalley.png',
    hexTheme: 'forest-green',
  },
  stats: { power: 2, accuracy: 5, recovery: 4 },
  specialAbilities: [],
}

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

function renderApp(initialPath = '/', store = makeStore()) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )
}

describe('App', () => {
  it('renders without crashing', () => {
    renderApp()
    expect(screen.getAllByText(/Hex Hole Heroes/i).length).toBeGreaterThan(0)
  })

  it('redirects to /new-game when there is no active game', () => {
    renderApp('/')
    expect(
      screen.getByRole('heading', { name: /new game/i }),
    ).toBeInTheDocument()
  })

  it('shows the home page when there is an active game', () => {
    const store = makeStore()
    store.dispatch(startGame({ golfer: sampleGolfer, clubs: [], holes: 9 }))
    renderApp('/', store)
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument()
  })

  it('shows the new game page at /new-game', () => {
    renderApp('/new-game')
    expect(
      screen.getByRole('heading', { name: /new game/i }),
    ).toBeInTheDocument()
  })
})
