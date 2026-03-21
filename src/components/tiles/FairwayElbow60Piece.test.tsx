import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import FairwayElbow60Piece from './FairwayElbow60Piece'

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

describe('FairwayElbow60Piece', () => {
  it('renders 55 hexes (convex 60° elbow, armLen=5, width=5)', () => {
    render(<FairwayElbow60Piece origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(55)
  })

  it('renders hexes with forest-green fill', () => {
    render(<FairwayElbow60Piece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#228B22')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<FairwayElbow60Piece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<FairwayElbow60Piece origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation for alternate dogleg orientations', () => {
    render(<FairwayElbow60Piece origin={{ q: 0, r: 0 }} rotation={60} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('60')
  })
})
