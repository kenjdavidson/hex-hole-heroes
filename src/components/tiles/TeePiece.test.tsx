import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import TeePiece from './TeePiece'

vi.mock('react-konva', () => ({
  Group: ({ children, x, y, rotation }: { children: React.ReactNode; x: number; y: number; rotation: number }) => (
    <div data-testid="group" data-x={x} data-y={y} data-rotation={rotation}>
      {children}
    </div>
  ),
  Line: ({ fill, closed }: { points: number[]; fill: string; closed: boolean }) => (
    <div data-testid="hex" data-fill={fill} data-closed={String(closed)} />
  ),
}))

describe('TeePiece', () => {
  it('renders 18 hexes (3×6 rectangle)', () => {
    render(<TeePiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(18)
  })

  it('renders hexes with tee fill', () => {
    render(<TeePiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#66BB6A')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<TeePiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<TeePiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<TeePiece origin={{ q: 0, r: 0 }} rotation={60} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('60')
  })
})
