import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import EvergreenPiece from './EvergreenPiece'

vi.mock('react-konva', () => ({
  Group: ({
    children,
    x,
    y,
    rotation,
  }: {
    children: React.ReactNode
    x: number
    y: number
    rotation: number
  }) => (
    <div data-testid="group" data-x={x} data-y={y} data-rotation={rotation}>
      {children}
    </div>
  ),
  Line: ({ fill, closed }: { points: number[]; fill: string; closed: boolean }) => (
    <div data-testid="hex" data-fill={fill} data-closed={String(closed)} />
  ),
}))

describe('EvergreenPiece', () => {
  it('renders 7 hexes (center + 6 neighbors)', () => {
    render(<EvergreenPiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(7)
  })

  it('renders hexes with evergreen fill', () => {
    render(<EvergreenPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#1B5E20')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<EvergreenPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<EvergreenPiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<EvergreenPiece origin={{ q: 0, r: 0 }} rotation={60} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('60')
  })
})
