import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import GreenStamp from './GreenStamp'

vi.mock('react-konva', () => ({
  Group: ({ children, x, y, rotation }: { children: React.ReactNode; x: number; y: number; rotation: number }) => (
    <div data-testid="group" data-x={x} data-y={y} data-rotation={rotation}>
      {children}
    </div>
  ),
  Line: ({ fill, closed }: { points: number[]; fill: string; closed: boolean }) => (
    <div data-testid="hex" data-fill={fill} data-closed={String(closed)} />
  ),
  Circle: ({ fill, radius }: { fill: string; radius: number }) => (
    <div data-testid="pin" data-fill={fill} data-radius={radius} />
  ),
}))

describe('GreenStamp', () => {
  it('renders 19 hexes (Mega-Flower: center + 2 rings)', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(19)
  })

  it('renders hexes with lawn-green fill', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#7CFC00')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('renders a pin marker at the centre', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('pin')).toBeInTheDocument()
  })

  it('pin marker has white fill', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('pin').getAttribute('data-fill')).toBe('#FFFFFF')
  })

  it('defaults rotation to 0', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<GreenStamp origin={{ q: 0, r: 0 }} rotation={45} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('45')
  })
})
