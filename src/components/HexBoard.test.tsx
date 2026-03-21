import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HexBoard from './HexBoard'
import { useGameStore } from '../store/hexStore'

vi.mock('react-konva', () => ({
  Stage: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="stage">{children}</div>
  ),
  Layer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layer">{children}</div>
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
  it('renders the Konva stage', () => {
    render(<HexBoard />)
    expect(screen.getByTestId('stage')).toBeInTheDocument()
  })

  it('renders 1512 hexagons for a 42×36 grid', () => {
    render(<HexBoard />)
    const hexEls = screen.getAllByTestId('hex')
    expect(hexEls).toHaveLength(1512)
  })

  it('all hexagons default to rough fill colour', () => {
    useGameStore.setState({ ballQ: -999, ballR: -999 })
    render(<HexBoard />)
    const hexEls = screen.getAllByTestId('hex')
    const roughFill = '#5C7A2E'
    expect(hexEls.every((el) => el.getAttribute('data-fill') === roughFill)).toBe(true)
  })

  it('marks the ball hex with a different fill colour', () => {
    useGameStore.setState({ ballQ: 0, ballR: 0 })
    render(<HexBoard />)
    const hexEls = screen.getAllByTestId('hex')
    const whiteFills = hexEls.filter((el) => el.getAttribute('data-fill') === '#FFFFFF')
    expect(whiteFills).toHaveLength(1)
  })

  it('all hexagons are closed polygons', () => {
    render(<HexBoard />)
    const hexEls = screen.getAllByTestId('hex')
    expect(hexEls.every((el) => el.getAttribute('data-closed') === 'true')).toBe(true)
  })
})
