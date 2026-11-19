import { describe, expect, it } from 'vitest'
import { fairwayOffsets, fringeOffsets, greenOffsets, hazardOffsets } from './terrainShapes'
import type { FairwayShape, GreenShape } from './terrainShapes'
import type { HexOffset } from './pieceTypes'

const key = ({ dq, dr }: HexOffset) => `${dq},${dr}`
const neighbors = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]

function components(offsets: HexOffset[]): number {
  const remaining = new Set(offsets.map(key))
  let count = 0
  while (remaining.size) {
    count++
    const pending = [remaining.values().next().value as string]
    remaining.delete(pending[0])
    while (pending.length) {
      const [q, r] = pending.pop()!.split(',').map(Number)
      for (const [dq, dr] of neighbors) {
        const next = `${q + dq},${r + dr}`
        if (remaining.delete(next)) pending.push(next)
      }
    }
  }
  return count
}

describe('terrain shapes', () => {
  it.each<FairwayShape>(['straight', 'short', 'long', 'dogleg-left', 'dogleg-right', 'split'])(
    'provides a distinct, duplicate-free %s fairway with the expected connectivity',
    (shape) => {
      const offsets = fairwayOffsets(shape)
      expect(new Set(offsets.map(key)).size).toBe(offsets.length)
      expect(components(offsets)).toBe(shape === 'split' ? 2 : 1)
      expect(offsets.length).toBeGreaterThanOrEqual(60)
    },
  )

  it.each<GreenShape>(['round', 'square', 'oval', 'long', 'bean', 'flower'])(
    'wraps every edge of the %s green in one hex of fairway',
    (shape) => {
      const green = greenOffsets(shape)
      const fringe = fringeOffsets(green)
      const greenKeys = new Set(green.map(key))
      const fringeKeys = new Set(fringe.map(key))
      expect(greenKeys.has('0,0')).toBe(true)
      expect(components(green)).toBe(1)
      expect(fringeKeys.size).toBe(fringe.length)
      for (const { dq, dr } of green) {
        for (const [nq, nr] of neighbors) {
          expect(greenKeys.has(`${dq + nq},${dr + nr}`) || fringeKeys.has(`${dq + nq},${dr + nr}`)).toBe(true)
        }
      }
      for (const hex of fringe) {
        expect(greenKeys.has(key(hex))).toBe(false)
        expect(neighbors.some(([dq, dr]) => greenKeys.has(`${hex.dq + dq},${hex.dr + dr}`))).toBe(true)
      }
    },
  )

  it('supports rectangular, flower and bean hazards', () => {
    expect(hazardOffsets('rectangle', 6, 3)).toHaveLength(18)
    expect(hazardOffsets('flower', 6, 3)).toHaveLength(7)
    expect(hazardOffsets('bean', 6, 3)).toHaveLength(17)
    expect(components(hazardOffsets('bean', 6, 3))).toBe(1)
  })
})
