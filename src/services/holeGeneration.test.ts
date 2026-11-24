import { describe, expect, it } from 'vitest'
import { Grid, line, rectangle } from 'honeycomb-grid'
import { buildRectOffsets, HexTile } from '../utils/hexGrid'
import { fringeOffsets, greenOffsets } from '../components/tiles/terrainShapes'
import { BUNKER, FAIRWAY_FLOWER, FAIRWAY_LINE, WATER } from '../components/tiles/terrainOffsets'
import type { HexOffset } from '../components/tiles/pieceTypes'
import type { HoleTile } from '../types/hole'
import { generateHole, HOLE_COLS, HOLE_ROWS } from './holeGeneration'

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 2 ** 32
  }
}

const key = (q: number, r: number) => `${q},${r}`
function footprint(tile: HoleTile): string[] {
  const green = greenOffsets('round')
  const offsets: HexOffset[] = tile.type === 'tee' ? buildRectOffsets(3, 6)
    : tile.type === 'green' ? [...green, ...fringeOffsets(green)]
    : tile.type === 'fairway-line' ? FAIRWAY_LINE
    : tile.type === 'fairway-flower' ? FAIRWAY_FLOWER
    : tile.type === 'bunker' ? BUNKER : WATER
  return offsets.map(({ dq, dr }) => key(tile.origin.q + dq, tile.origin.r + dr))
}

describe('generateHole', () => {
  it('creates varied, bounded holes with reachable anchors and a two-hex safe route', () => {
    const grid = new Grid(HexTile, rectangle({ width: HOLE_COLS, height: HOLE_ROWS }))
    const counts = new Set<number>()
    const hazardTypes = new Set<string>()
    const tees = new Set<string>()
    const greens = new Set<string>()
    for (let seed = 1; seed <= 200; seed++) {
      const hole = generateHole(seeded(seed))
      const tee = hole.tiles.find((tile) => tile.type === 'tee')!
      const green = hole.tiles.find((tile) => tile.type === 'green')!
      const fairways = hole.tiles.filter((tile) => tile.type.startsWith('fairway-'))
      const hazards = hole.tiles.filter((tile) => tile.type === 'water' || tile.type === 'bunker')
      expect(tee.origin.r).toBeGreaterThanOrEqual(32)
      expect(tee.origin.r).toBeLessThan(36)
      expect(green.origin.r).toBeLessThan(4)
      expect(fairways.length).toBeGreaterThanOrEqual(3)
      expect(fairways.length).toBeLessThanOrEqual(5)
      counts.add(fairways.length)
      tees.add(key(tee.origin.q, tee.origin.r))
      greens.add(key(green.origin.q, green.origin.r))
      hazards.forEach((hazard) => hazardTypes.add(hazard.type))

      const occupied = new Set<string>()
      for (const tile of hole.tiles) {
        for (const hex of footprint(tile)) {
          const [q, r] = hex.split(',').map(Number)
          expect(grid.getHex({ q, r }), `${seed}: ${tile.type} ${hex}`).toBeDefined()
          expect(occupied.has(hex), `${seed}: overlapping ${tile.type} ${hex}`).toBe(false)
          occupied.add(hex)
        }
      }

      const hazardHexes = new Set(hazards.flatMap(footprint))
      const fairwayHexes = new Set(fairways.flatMap(footprint))
      for (const hazard of hazards) {
        const { q, r } = hazard.origin
        expect([[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]]
          .some(([dq, dr]) => fairwayHexes.has(key(q + dq, r + dr)))).toBe(true)
      }
      const anchors = [tee, ...fairways, green]
      for (let i = 1; i < anchors.length; i++) {
        const start = anchors[i - 1].origin
        const stop = anchors[i].origin
        const distance = grid.distance(start, stop)
        expect(distance).toBeGreaterThanOrEqual(6)
        expect(distance).toBeLessThanOrEqual(10)
        for (const hex of new Grid(HexTile, line({ start, stop }))) {
          expect(hazardHexes.has(key(hex.q, hex.r))).toBe(false)
          expect(hazardHexes.has(key(hex.q + 1, hex.r))).toBe(false)
        }
      }
    }
    expect(counts).toEqual(new Set([3, 4, 5]))
    expect(hazardTypes).toEqual(new Set(['bunker', 'water']))
    expect(tees.size).toBeGreaterThan(1)
    expect(greens.size).toBeGreaterThan(1)
  })

  it('is deterministic with the same random source and handles extreme rolls', () => {
    expect(generateHole(seeded(123))).toEqual(generateHole(seeded(123)))
    for (const roll of [0, 0.999999]) {
      expect(() => generateHole(() => roll)).not.toThrow()
    }
    expect(generateHole(() => 0.999999).tiles.some((tile) => tile.type === 'water' || tile.type === 'bunker')).toBe(false)
  })
})
