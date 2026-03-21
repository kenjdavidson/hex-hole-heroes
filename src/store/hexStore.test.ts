import { describe, it, expect, beforeEach } from 'vitest'
import { useHexStore } from './hexStore'

beforeEach(() => {
  useHexStore.setState({ ballQ: 0, ballR: 0 })
})

describe('useHexStore', () => {
  it('initialises with ball at (0, 0)', () => {
    const { ballQ, ballR } = useHexStore.getState()
    expect(ballQ).toBe(0)
    expect(ballR).toBe(0)
  })

  it('setBallPosition updates q and r', () => {
    useHexStore.getState().setBallPosition(5, 10)
    const { ballQ, ballR } = useHexStore.getState()
    expect(ballQ).toBe(5)
    expect(ballR).toBe(10)
  })

  it('setBallPosition replaces previous coordinates', () => {
    useHexStore.getState().setBallPosition(3, 7)
    useHexStore.getState().setBallPosition(12, 20)
    const { ballQ, ballR } = useHexStore.getState()
    expect(ballQ).toBe(12)
    expect(ballR).toBe(20)
  })

  it('setBallPosition accepts negative coordinates', () => {
    useHexStore.getState().setBallPosition(-1, -5)
    const { ballQ, ballR } = useHexStore.getState()
    expect(ballQ).toBe(-1)
    expect(ballR).toBe(-5)
  })
})
