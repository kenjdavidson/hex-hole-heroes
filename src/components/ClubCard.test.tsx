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

  it('does not show scatter when scatter is 0', () => {
    render(<ClubCard club={ironClub} />)
    expect(screen.queryByText('scatter:')).not.toBeInTheDocument()
  })

  it('does not show ability star when ability is null', () => {
    render(<ClubCard club={noAbilityClub} />)
    expect(screen.queryByText(/★/)).not.toBeInTheDocument()
  })

  describe('selection', () => {
    it('does not have role="button" when no onClick is provided', () => {
      render(<ClubCard club={woodClub} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('has role="button" when onClick is provided', () => {
      render(<ClubCard club={woodClub} onClick={() => {}} />)
      expect(screen.getByRole('button', { name: /Driver/ })).toBeInTheDocument()
    })

    it('has aria-pressed="false" when selected is false and onClick provided', () => {
      render(<ClubCard club={woodClub} onClick={() => {}} selected={false} />)
      expect(screen.getByRole('button', { name: /Driver/ })).toHaveAttribute('aria-pressed', 'false')
    })

    it('has aria-pressed="true" when selected is true', () => {
      render(<ClubCard club={woodClub} onClick={() => {}} selected={true} />)
      expect(screen.getByRole('button', { name: /Driver/ })).toHaveAttribute('aria-pressed', 'true')
    })

    it('calls onClick with the club when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<ClubCard club={woodClub} onClick={handleClick} />)
      await user.click(screen.getByRole('button', { name: /Driver/ }))
      expect(handleClick).toHaveBeenCalledWith(woodClub)
    })

    it('calls onClick when Enter key is pressed', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<ClubCard club={woodClub} onClick={handleClick} />)
      screen.getByRole('button', { name: /Driver/ }).focus()
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledWith(woodClub)
    })

    it('calls onClick when Space key is pressed', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<ClubCard club={woodClub} onClick={handleClick} />)
      screen.getByRole('button', { name: /Driver/ }).focus()
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledWith(woodClub)
    })
  })
})

