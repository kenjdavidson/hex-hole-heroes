import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import DeciduousPiece from './DeciduousPiece'

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

describe('DeciduousPiece', () => {
  it('renders 7 hexes (center + 6 neighbors)', () => {
    render(<DeciduousPiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(7)
  })

  it('renders hexes with deciduous fill', () => {
    render(<DeciduousPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#558B2F')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<DeciduousPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<DeciduousPiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<DeciduousPiece origin={{ q: 0, r: 0 }} rotation={60} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('60')
  })
})
