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
import gameReducer from '../store/gameSlice'
import theme from '../theme'
import NewGamePage from './NewGamePage'

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

function renderPage() {
  const store = makeStore()
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/new-game']}>
          <ThemeProvider theme={theme}>
            <Routes>
              <Route path="/new-game" element={<NewGamePage />} />
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ThemeProvider>
        </MemoryRouter>
      </Provider>,
    ),
  }
}

describe('NewGamePage', () => {
  it('renders the page title', () => {
    renderPage()
    expect(
      screen.getByRole('heading', { name: /new game/i }),
    ).toBeInTheDocument()
  })

  it('renders all 6 golfer cards', () => {
    renderPage()
    expect(screen.getByLabelText("Select 'Ace' O'Malley")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Boomer' Benson")).toBeInTheDocument()
    expect(
      screen.getByLabelText("Select 'Calamity' Jane"),
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Dimples' Davis")).toBeInTheDocument()
    expect(screen.getByLabelText("Select 'Evie' Eagle")).toBeInTheDocument()
    expect(
      screen.getByLabelText("Select 'Flop' Ferguson"),
    ).toBeInTheDocument()
  })

  it('has 9 holes selected by default', () => {
    renderPage()
    const nineBtn = screen.getByRole('button', { name: /9 holes/i })
    expect(nineBtn).toHaveAttribute('aria-pressed', 'true')
    const eighteenBtn = screen.getByRole('button', { name: /18 holes/i })
    expect(eighteenBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('Start Game button is disabled when no golfer is selected', () => {
    renderPage()
    expect(
      screen.getByRole('button', { name: /start game/i }),
    ).toBeDisabled()
  })

  it('Start Game button is enabled after selecting a golfer', async () => {
    renderPage()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    expect(
      screen.getByRole('button', { name: /start game/i }),
    ).not.toBeDisabled()
  })

  it('selecting a golfer marks that card as selected', async () => {
    renderPage()
    const user = userEvent.setup()
    const card = screen.getByLabelText("Select 'Ace' O'Malley")
    expect(card).toHaveAttribute('aria-pressed', 'false')
    await user.click(card)
    expect(card).toHaveAttribute('aria-pressed', 'true')
  })

  it('dispatches startGame and navigates to / on Start Game click', async () => {
    const { store } = renderPage()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    await user.click(screen.getByRole('button', { name: /start game/i }))
    const game = store.getState().game.activeGame
    expect(game).not.toBeNull()
    expect(game?.golfer.id).toBe('ace-omalley')
    expect(game?.holes).toBe(9)
    expect(game?.clubs.length).toBeGreaterThan(0)
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('also updates the selected golfer in the player slice', async () => {
    const { store } = renderPage()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    await user.click(screen.getByRole('button', { name: /start game/i }))
    expect(store.getState().player.selectedGolfer?.id).toBe('ace-omalley')
  })

  it('selecting 18 holes creates a game with 18 holes', async () => {
    const { store } = renderPage()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /18 holes/i }))
    await user.click(screen.getByLabelText("Select 'Ace' O'Malley"))
    await user.click(screen.getByRole('button', { name: /start game/i }))
    expect(store.getState().game.activeGame?.holes).toBe(18)
  })
})
