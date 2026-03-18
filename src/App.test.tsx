import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from './store'
import App from './App'

function renderApp() {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </Provider>,
  )
}

describe('App', () => {
  it('renders without crashing', () => {
    renderApp()
    expect(screen.getAllByText(/Hex Hole Heroes/i).length).toBeGreaterThan(0)
  })

  it('shows the coming soon message on the home page', () => {
    renderApp()
    expect(screen.getByText(/Coming Soon/i)).toBeInTheDocument()
  })
})
