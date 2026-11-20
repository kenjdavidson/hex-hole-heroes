import { describe, it, expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import React from 'react'
import HexBoard from './HexBoard'
import { useHexStore } from '../store/hexStore'
import hole1 from '../data/hole1.json'
import { getHexCenter, HexTile } from '../utils/hexGrid'
import { TerrainColors } from './tiles'
import type { Hole } from '../types/hole'

vi.mock('react-konva', () => ({
  Stage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stage">{children}</div>
  ),
  Layer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layer">{children}</div>
  ),
  Group: ({ children, x, y, rotation }: { children: React.ReactNode; x: number; y: number; rotation: number }) => (
    <div data-testid="piece" data-x={x} data-y={y} data-rotation={rotation}>{children}</div>
  ),
  Circle: () => <div data-testid="pin" />,
  Rect: ({ fill }: { fill: string }) => (
    <div data-testid="bg-rect" data-fill={fill} />
  ),
  Line: ({
    points,
    fill,
    closed,
  }: {
    points: number[]
    fill: string
    closed: boolean
  }) => (
    <div
      data-testid="hex"
      data-fill={fill}
      data-closed={String(closed)}
      data-points={points.join(',')}
    />
  ),
}))

describe('HexBoard', () => {
  it('loads the Par 4 dogleg blueprint with its tee and green at the expected rows', () => {
    expect(hole1).toMatchObject({ id: 'hole-01', par: 4, default_wind: 0 })
    expect(hole1.tiles.find((tile) => tile.type === 'tee')?.origin.r).toBe(34)
    expect(hole1.tiles.find((tile) => tile.type === 'green')?.origin.r).toBe(5)
  })

  it('renders a background rect with rough fill colour', () => {
    render(<HexBoard />)
    const bgRect = screen.getByTestId('bg-rect')
    expect(bgRect).toBeInTheDocument()
    expect(bgRect.getAttribute('data-fill')).toBe('#5C7A2E')
  })

  it('renders the Konva stage', () => {
    render(<HexBoard />)
    expect(screen.getByTestId('stage')).toBeInTheDocument()
  })

  it('renders 4800 hexagons for a 80×60 grid', () => {
    render(<HexBoard />)
    const hexEls = screen.getAllByTestId('hex').filter((el) => el.getAttribute('data-fill') === '#5C7A2E')
    expect(hexEls).toHaveLength(4800)
  })

  it('renders the blueprint pieces at their origins with their rotations', () => {
    render(<HexBoard />)
    const pieces = screen.getAllByTestId('piece')
    expect(pieces).toHaveLength(hole1.tiles.length)
    hole1.tiles.forEach((tile, index) => {
      const { x, y } = getHexCenter(tile.origin.q, tile.origin.r)
      expect(pieces[index]).toHaveAttribute('data-x', String(x))
      expect(pieces[index]).toHaveAttribute('data-y', String(y))
      expect(pieces[index]).toHaveAttribute('data-rotation', String(tile.rotation))
    })
    for (const fill of [TerrainColors.TEE_FILL, TerrainColors.FAIRWAY_FILL, TerrainColors.WATER_FILL, TerrainColors.SAND_FILL, TerrainColors.GREEN_FILL]) {
      expect(screen.getAllByTestId('hex').some((el) => el.getAttribute('data-fill') === fill)).toBe(true)
    }
    expect(screen.getByTestId('pin')).toBeInTheDocument()
  })

  it('places the ball on the tee above the terrain and allows it to move', () => {
    useHexStore.setState({ ballQ: 0, ballR: 0 })
    render(<HexBoard />)
    const tee = hole1.tiles.find((tile) => tile.type === 'tee')!
    expect(useHexStore.getState()).toMatchObject({ ballQ: tee.origin.q, ballR: tee.origin.r })
    const ball = screen.getByTestId('layer').lastElementChild
    expect(ball).toHaveAttribute('data-fill', '#FFFFFF')
    expect(ball).toHaveAttribute('data-points', new HexTile(tee.origin).corners.flatMap((c) => [c.x, c.y]).join(','))
    act(() => useHexStore.getState().setBallPosition(1, 1))
    expect(useHexStore.getState()).toMatchObject({ ballQ: 1, ballR: 1 })
  })

  it('places the ball on the tee of a newly loaded hole', () => {
    const hole: Hole = { id: 'other', par: 3, default_wind: 0, tiles: [
      { type: 'tee', origin: { q: 5, r: 10 }, rotation: 60 },
    ] }
    const { rerender } = render(<HexBoard />)
    rerender(<HexBoard hole={hole} />)
    expect(useHexStore.getState()).toMatchObject({ ballQ: 5, ballR: 10 })
    expect(screen.getByTestId('piece')).toHaveAttribute('data-rotation', '60')
  })

  it('all hexagons are closed polygons', () => {
    render(<HexBoard />)
    const hexEls = screen.getAllByTestId('hex')
    expect(hexEls.every((el) => el.getAttribute('data-closed') === 'true')).toBe(true)
  })
})
