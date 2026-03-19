import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

  it('always shows the club name in the card body without hovering', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('Driver')).toBeInTheDocument()
  })

  it('always shows the distance range in the card body without hovering', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('12–15')).toBeInTheDocument()
  })

  it('always shows the club type in the card body without hovering', () => {
    render(<ClubCard club={woodClub} />)
    // club type appears in card body header
    expect(screen.getByText('Wood')).toBeInTheDocument()
  })

  it('always shows scatter in the card body when scatter > 0', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('scatter:')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('always shows ability in the card body when present', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText(/Power Draw/)).toBeInTheDocument()
  })

  it('shows full club name in tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    // After hover, tooltip popup adds a second occurrence of the name alongside the card body
    await waitFor(() => expect(screen.getAllByText('Driver')).toHaveLength(2))
  })

  it('shows full club name in tooltip on keyboard focus', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.tab()
    // After focus, tooltip popup adds a second occurrence of the name alongside the card body
    await waitFor(() => expect(screen.getAllByText('Driver')).toHaveLength(2))
  })

  it('shows distance range in tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    // After hover, tooltip popup adds a second occurrence of the distance alongside the card body
    await waitFor(() => expect(screen.getAllByText('12–15')).toHaveLength(2))
  })

  it('shows scatter in tooltip when scatter > 0', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    // scatter count appears in both card body and tooltip after hover
    await waitFor(() => expect(screen.getAllByText('2')).toHaveLength(2))
  })

  it('shows ability in tooltip when present', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} />)
    await user.hover(screen.getByLabelText(/Driver/))
    // ability appears in both card body and tooltip after hover
    await waitFor(() => expect(screen.getAllByText(/Power Draw/)).toHaveLength(2))
  })

  it('does not show scatter when scatter is 0', () => {
    render(<ClubCard club={ironClub} />)
    expect(screen.queryByText('scatter:')).not.toBeInTheDocument()
  })

  it('does not show ability star when ability is null', () => {
    render(<ClubCard club={noAbilityClub} />)
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
  })

  it('does not show a tooltip popup when enableTooltip is false', async () => {
    const user = userEvent.setup()
    render(<ClubCard club={woodClub} enableTooltip={false} />)
    await user.hover(screen.getByLabelText(/Driver/))
    // Card body always shows the name, but no tooltip popup means only one occurrence
    expect(screen.getAllByText('Driver')).toHaveLength(1)
  })
})
