import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './hexStore'

beforeEach(() => {
  useGameStore.setState({ ballQ: 0, ballR: 0 })
})

describe('useGameStore', () => {
  it('initialises with ball at (0, 0)', () => {
    const { ballQ, ballR } = useGameStore.getState()
    expect(ballQ).toBe(0)
    expect(ballR).toBe(0)
  })

  it('setBallPosition updates q and r', () => {
    useGameStore.getState().setBallPosition(5, 10)
    const { ballQ, ballR } = useGameStore.getState()
    expect(ballQ).toBe(5)
    expect(ballR).toBe(10)
  })

  it('setBallPosition replaces previous coordinates', () => {
    useGameStore.getState().setBallPosition(3, 7)
    useGameStore.getState().setBallPosition(12, 20)
    const { ballQ, ballR } = useGameStore.getState()
    expect(ballQ).toBe(12)
    expect(ballR).toBe(20)
  })

  it('setBallPosition accepts negative coordinates', () => {
    useGameStore.getState().setBallPosition(-1, -5)
    const { ballQ, ballR } = useGameStore.getState()
    expect(ballQ).toBe(-1)
    expect(ballR).toBe(-5)
  })
})
