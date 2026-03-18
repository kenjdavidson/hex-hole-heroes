import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../store/apiSlice'
import playerReducer from '../store/playerSlice'
import theme from '../theme'
import Layout from './Layout'

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

  it('renders the scorecard panel', () => {
    renderLayout()
    expect(screen.getByLabelText('scorecard panel')).toBeInTheDocument()
    expect(screen.getByText('Scorecard')).toBeInTheDocument()
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
    expect(screen.getByText('Select Golfer')).toBeInTheDocument()
  })

  it('shows golfer list when "Select Golfer" is clicked', async () => {
    renderLayout()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    await user.click(screen.getByText('Select Golfer'))
    expect(screen.getByText('Player 1')).toBeInTheDocument()
    expect(screen.getByText('Player 2')).toBeInTheDocument()
  })

  it('updates selected player and status bar when a golfer is selected', async () => {
    renderLayout()
    const user = userEvent.setup()
    await user.click(screen.getByLabelText('open menu'))
    await user.click(screen.getByText('Select Golfer'))
    await user.click(screen.getByText('Player 1'))
    expect(screen.getByText('P1')).toBeInTheDocument()
    expect(screen.getByText(/Active golfer: Player 1/i)).toBeInTheDocument()
  })
})
