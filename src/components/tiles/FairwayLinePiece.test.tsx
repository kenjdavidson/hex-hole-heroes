import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import FairwayLinePiece from './FairwayLinePiece'

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

describe('FairwayLinePiece', () => {
  it('renders 3 hexes', () => {
    render(<FairwayLinePiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(3)
  })

  it('renders hexes with forest-green fill', () => {
    render(<FairwayLinePiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#228B22')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<FairwayLinePiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<FairwayLinePiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<FairwayLinePiece origin={{ q: 0, r: 0 }} rotation={120} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('120')
  })
})
