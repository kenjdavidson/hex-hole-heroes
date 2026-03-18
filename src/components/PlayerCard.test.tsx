import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Golfer } from '../store/playerSlice'
import PlayerCard from './PlayerCard'

const mockGolfer: Golfer = {
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
  specialAbilities: [
    {
      id: 'old-school',
      name: 'Old School Lore',
      effect: 'Negate one Wind modifier per hole.',
    },
  ],
}

describe('PlayerCard', () => {
  it('renders the golfer name', () => {
    render(<PlayerCard golfer={mockGolfer} />)
    expect(screen.getByText("'Ace' O'Malley")).toBeInTheDocument()
  })

  it('renders the golfer initials in the center', () => {
    render(<PlayerCard golfer={mockGolfer} />)
    expect(screen.getByText('ACE')).toBeInTheDocument()
  })

  it('renders the golfer archetype', () => {
    render(<PlayerCard golfer={mockGolfer} />)
    expect(screen.getByText('The Veteran')).toBeInTheDocument()
  })

  it('has an accessible role of button', () => {
    render(<PlayerCard golfer={mockGolfer} />)
    expect(screen.getByRole('button', { name: /Select 'Ace' O'Malley/i })).toBeInTheDocument()
  })

  it('calls onClick with the golfer when clicked', async () => {
    const handleClick = vi.fn()
    render(<PlayerCard golfer={mockGolfer} onClick={handleClick} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledWith(mockGolfer)
  })

  it('logs the golfer id to the console when clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<PlayerCard golfer={mockGolfer} />)
    const user = userEvent.setup()
    await user.click(screen.getByRole('button'))
    expect(consoleSpy).toHaveBeenCalledWith('ace-omalley')
    consoleSpy.mockRestore()
  })

  it('activates via keyboard Enter', async () => {
    const handleClick = vi.fn()
    render(<PlayerCard golfer={mockGolfer} onClick={handleClick} />)
    const user = userEvent.setup()
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalledWith(mockGolfer)
  })

  it('reflects selected state via aria-pressed', () => {
    render(<PlayerCard golfer={mockGolfer} selected />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('reflects unselected state via aria-pressed when not selected', () => {
    render(<PlayerCard golfer={mockGolfer} selected={false} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})
