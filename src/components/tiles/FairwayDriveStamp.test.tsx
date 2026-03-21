import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import FairwayDriveStamp from './FairwayDriveStamp'

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

describe('FairwayDriveStamp', () => {
  it('renders 80 hexes (16×5 drive block)', () => {
    render(<FairwayDriveStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(80)
  })

  it('renders hexes with forest-green fill', () => {
    render(<FairwayDriveStamp origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#228B22')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<FairwayDriveStamp origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<FairwayDriveStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<FairwayDriveStamp origin={{ q: 0, r: 0 }} rotation={90} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('90')
  })
})
