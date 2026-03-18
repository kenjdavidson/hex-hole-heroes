import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Club } from '../types/club'
import ClubCard from './ClubCard'

const woodClub: Club = {
  id: 'dr',
  name: 'Driver',
  type: 'Wood',
  dist: [12, 15],
  scatter: 2,
  ability: 'Power Draw: +2 Hexes on Fairway',
}

const ironClub: Club = {
  id: '7i',
  name: '7-Iron',
  type: 'Iron',
  dist: [5, 5],
  scatter: 0,
  ability: 'Backspin: Move 1 hex back on Green',
}

const noAbilityClub: Club = {
  id: '4i',
  name: '4-Iron',
  type: 'Iron',
  dist: [8, 8],
  scatter: 1,
  ability: null,
}

describe('ClubCard', () => {
  it('renders the club ID in the stub', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('dr')).toBeInTheDocument()
  })

  it('has an accessible aria-label with name, type, and distance range', () => {
    render(<ClubCard club={woodClub} />)
    expect(
      screen.getByLabelText('Driver, Wood, distance 12–15 hexes'),
    ).toBeInTheDocument()
  })

  it('has an accessible aria-label with single distance when min equals max', () => {
    render(<ClubCard club={ironClub} />)
    expect(
      screen.getByLabelText('7-Iron, Iron, distance 5 hexes'),
    ).toBeInTheDocument()
  })

  it('is keyboard focusable', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByLabelText(/Driver/)).toHaveAttribute('tabindex', '0')
  })

  it('shows full club name in tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    expect(await screen.findByText('Driver')).toBeInTheDocument()
  })

  it('shows full club name in tooltip on keyboard focus', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.tab()
    expect(await screen.findByText('Driver')).toBeInTheDocument()
  })

  it('shows distance range in tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    expect(await screen.findByText('12–15')).toBeInTheDocument()
  })

  it('shows scatter in tooltip when scatter > 0', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    await screen.findByText('Driver') // wait for tooltip
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows ability in tooltip when present', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    expect(await screen.findByText(/Power Draw/)).toBeInTheDocument()
  })

  it('does not show scatter when scatter is 0', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={ironClub} />)
    await user.hover(screen.getByLabelText(/7-Iron/))
    await screen.findByText('7-Iron') // wait for tooltip
    expect(screen.queryByText('scatter:')).not.toBeInTheDocument()
  })

  it('does not show ability star when ability is null', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={noAbilityClub} />)
    await user.hover(screen.getByLabelText(/4-Iron/))
    await screen.findByText('4-Iron') // wait for tooltip
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
  })
})
