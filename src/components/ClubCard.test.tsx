import { describe, it, expect, vi } from 'vitest'
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
  it('renders the club name', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('Driver')).toBeInTheDocument()
  })

  it('renders the club ID in uppercase', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('dr')).toBeInTheDocument()
  })

  it('renders the club type', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('Wood')).toBeInTheDocument()
  })

  it('renders distance range when min and max differ', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('12–15')).toBeInTheDocument()
  })

  it('renders single distance value when min equals max', () => {
    render(<ClubCard club={ironClub} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders scatter value when scatter > 0', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not render scatter section when scatter is 0', () => {
    render(<ClubCard club={ironClub} />)
    expect(screen.queryByText('scatter:')).not.toBeInTheDocument()
  })

  it('renders ability text when present', () => {
    render(<ClubCard club={woodClub} />)
    expect(screen.getByText(/Power Draw/)).toBeInTheDocument()
  })

  it('does not render ability section when ability is null', () => {
    render(<ClubCard club={noAbilityClub} />)
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
  })

  it('has an accessible role of button', () => {
    render(<ClubCard club={woodClub} />)
    expect(
      screen.getByRole('button', { name: /Driver, Wood/ }),
    ).toBeInTheDocument()
  })

  it('reflects selected state via aria-pressed', () => {
    render(<ClubCard club={woodClub} selected />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('reflects unselected state via aria-pressed when not selected', () => {
    render(<ClubCard club={woodClub} selected={false} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onClick with the club when clicked', async () => {
    const handleClick = vi.fn()
    render(<ClubCard club={woodClub} onClick={handleClick} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith(woodClub)
  })

  it('activates via keyboard Enter', async () => {
    const handleClick = vi.fn()
    render(<ClubCard club={woodClub} onClick={handleClick} />)
    const user = userEvent.setup()
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledWith(woodClub)
  })

  it('activates via keyboard Space', async () => {
    const handleClick = vi.fn()
    render(<ClubCard club={woodClub} onClick={handleClick} />)
    const user = userEvent.setup()
    screen.getByRole('button').focus()
    await user.keyboard(' ')
    expect(handleClick).toHaveBeenCalledWith(woodClub)
  })
})
