import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import TerrainPiece from './TerrainPiece'
import { getHexCenter } from '../../utils/hexGrid'

vi.mock('react-konva', () => ({
  Group: ({ children, x, y, rotation }: { children: React.ReactNode; x: number; y: number; rotation: number }) => (
    <div data-testid="group" data-x={x} data-y={y} data-rotation={rotation}>{children}</div>
  ),
  Line: ({ points, fill, stroke }: { points: number[]; fill: string; stroke: string }) => (
    <div data-testid="hex" data-points={points.join(',')} data-fill={fill} data-stroke={stroke} />
  ),
}))

describe('TerrainPiece', () => {
  it('positions relative hexes at the given origin and forwards colors and rotation', () => {
    const origin = { q: 4, r: -2 }
    render(<TerrainPiece origin={origin} rotation={120} offsets={[{ dq: 0, dr: 0 }, { dq: 1, dr: 0 }]} fill="red" stroke="blue" />)
    const center = getHexCenter(origin.q, origin.r)
    expect(screen.getByTestId('group')).toHaveAttribute('data-x', String(center.x))
    expect(screen.getByTestId('group')).toHaveAttribute('data-y', String(center.y))
    expect(screen.getByTestId('group')).toHaveAttribute('data-rotation', '120')
    const hexes = screen.getAllByTestId('hex')
    expect(hexes).toHaveLength(2)
    expect(hexes[0]).toHaveAttribute('data-fill', 'red')
    expect(hexes[0]).toHaveAttribute('data-stroke', 'blue')
    expect(hexes[0].getAttribute('data-points')).not.toBe(hexes[1].getAttribute('data-points'))
  })
})
