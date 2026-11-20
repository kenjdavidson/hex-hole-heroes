import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import FairwayPiece from './FairwayPiece'

vi.mock('react-konva', () => ({
  Group: ({ children, x, y, rotation }: { children: React.ReactNode; x: number; y: number; rotation: number }) => (
    <div data-testid="group" data-x={x} data-y={y} data-rotation={rotation}>{children}</div>
  ),
  Line: ({ fill, closed }: { fill: string; closed: boolean }) => (
    <div data-testid="hex" data-fill={fill} data-closed={String(closed)} />
  ),
}))

describe('FairwayPiece', () => {
  it('renders a 6 by 20 fairway by default', () => {
    render(<FairwayPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes).toHaveLength(120)
    expect(hexes.every((hex) => hex.getAttribute('data-fill') === '#228B22' && hex.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('supports a rotated split fairway', () => {
    render(<FairwayPiece origin={{ q: 3, r: 4 }} shape="split" rotation={60} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(120)
    expect(screen.getByTestId('group')).toHaveAttribute('data-rotation', '60')
  })
})
