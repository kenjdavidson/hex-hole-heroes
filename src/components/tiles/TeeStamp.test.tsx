import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import TeeStamp from './TeeStamp'

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

describe('TeeStamp', () => {
  it('renders 1 hex', () => {
    render(<TeeStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getAllByTestId('hex')).toHaveLength(1)
  })

  it('renders hex with grey fill', () => {
    render(<TeeStamp origin={{ q: 0, r: 0 }} />)
    const hex = screen.getByTestId('hex')
    expect(hex.getAttribute('data-fill')).toBe('#9E9E9E')
  })

  it('renders a closed polygon', () => {
    render(<TeeStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('hex').getAttribute('data-closed')).toBe('true')
  })

  it('defaults rotation to 0', () => {
    render(<TeeStamp origin={{ q: 0, r: 0 }} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('0')
  })

  it('applies a custom rotation', () => {
    render(<TeeStamp origin={{ q: 0, r: 0 }} rotation={60} />)
    expect(screen.getByTestId('group').getAttribute('data-rotation')).toBe('60')
  })
})
