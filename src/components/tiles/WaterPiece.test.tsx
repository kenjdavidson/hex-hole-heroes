import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import WaterPiece from './WaterPiece'

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

describe('WaterPiece', () => {
  it('renders 3 hexes', () => {
    render(<WaterPiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(3)
  })

  it('renders hexes with water fill', () => {
    render(<WaterPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-fill') === '#4A90C4')).toBe(true)
  })

  it('renders all closed polygons', () => {
    render(<WaterPiece origin={{ q: 0, r: 0 }} />)
    const hexes = screen.getAllByTestId('hex')
    expect(hexes.every((h) => h.getAttribute('data-closed') === 'true')).toBe(true)
  })

  it('defaults rotation to 0', () => {
    render(<WaterPiece origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<WaterPiece origin={{ q: 0, r: 0 }} rotation={60} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('60')
  })

  it('supports a long creek and an irregular pond', () => {
    const { rerender } = render(<WaterPiece origin={{ q: 0, r: 0 }} width={10} height={2} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(20)
    rerender(<WaterPiece origin={{ q: 0, r: 0 }} shape="bean" width={6} height={3} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(17)
  })
})
