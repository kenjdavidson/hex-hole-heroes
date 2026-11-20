import { Grid, line, rectangle } from 'honeycomb-grid'
import { buildRectOffsets, HexTile } from '../utils/hexGrid'
import { fringeOffsets, greenOffsets } from '../components/tiles/terrainShapes'
import { BUNKER, FAIRWAY_FLOWER, FAIRWAY_LINE, NEIGHBORS, WATER } from '../components/tiles/terrainOffsets'
import type { HexOffset } from '../components/tiles/pieceTypes'
import type { Hole, HoleTile } from '../types/hole'

export const HOLE_COLS = 42
export const HOLE_ROWS = 36

type Coord = { q: number; r: number }
const key = ({ q, r }: Coord) => `${q},${r}`
const add = ({ q, r }: Coord, { dq, dr }: HexOffset): Coord => ({ q: q + dq, r: r + dr })
const at = (col: number, row: number): Coord => ({ q: col - Math.floor(row / 2), r: row })

export function generateHole(random: () => number = Math.random): Hole {
  const grid = new Grid(HexTile, rectangle({ width: HOLE_COLS, height: HOLE_ROWS }))
  const int = (min: number, max: number) => min + Math.floor(random() * (max - min + 1))
  const teeCol = int(12, 29)
  const greenCol = teeCol + int(-4, 4)
  const tee = at(teeCol, int(32, 33))
  const green = at(greenCol, 3)
  const count = int(3, 5)

  // Backtrack through dogleg candidates so every shot between anchors is 6–10 hexes.
  const findWaypoints = (total: number): Coord[] | undefined => {
    const search = (points: Coord[]): Coord[] | undefined => {
      const step = points.length
      if (step > total) {
        const distance = grid.distance(points[points.length - 1], green)
        return distance >= 6 && distance <= 10 ? points.slice(1) : undefined
      }
      const row = Math.round(tee.r + (green.r - tee.r) * step / (total + 1))
      const center = Math.round(teeCol + (greenCol - teeCol) * step / (total + 1))
      const offsets = [-4, -3, -2, 2, 3, 4]
      for (let i = offsets.length - 1; i > 0; i--) {
        const j = int(0, i)
        ;[offsets[i], offsets[j]] = [offsets[j], offsets[i]]
      }
      for (const offset of offsets) {
        const candidate = at(center + offset, row)
        const distance = grid.distance(points[points.length - 1], candidate)
        if (distance < 6 || distance > 10) continue
        const remaining = grid.distance(candidate, green)
        if (remaining > (total + 1 - step) * 10) continue
        const result = search([...points, candidate])
        if (result) return result
      }
      return undefined
    }
    return search([tee])
  }
  const waypoints = findWaypoints(count) ?? findWaypoints(4)
  if (!waypoints) throw new Error('Unable to generate a playable hole')

  const tiles: HoleTile[] = [{ type: 'tee', origin: tee, rotation: 0 }]
  const occupied = new Set<string>()
  const reserve = (origin: Coord, offsets: HexOffset[]) =>
    offsets.forEach((offset) => occupied.add(key(add(origin, offset))))
  reserve(tee, buildRectOffsets(3, 6))
  const greenShape = greenOffsets('round')
  reserve(green, [...greenShape, ...fringeOffsets(greenShape)])

  const fairwayHexes: Coord[] = []
  for (const origin of waypoints) {
    const flower = random() < 0.5
    const offsets = flower ? FAIRWAY_FLOWER : FAIRWAY_LINE
    tiles.push({ type: flower ? 'fairway-flower' : 'fairway-line', origin, rotation: 0 })
    reserve(origin, offsets)
    fairwayHexes.push(...offsets.map((offset) => add(origin, offset)))
  }

  // Keep a two-hex-wide rough/fairway corridor along the honeycomb path.
  const safe = new Set<string>()
  const anchors = [tee, ...waypoints, green]
  for (let i = 1; i < anchors.length; i++) {
    const path = new Grid(HexTile, line({ start: anchors[i - 1], stop: anchors[i] }))
    for (const hex of path) {
      safe.add(key(hex))
      safe.add(key(add(hex, { dq: 1, dr: 0 })))
    }
  }

  const candidates = new Map<string, Coord>()
  for (const hex of fairwayHexes) {
    for (const offset of NEIGHBORS) {
      const neighbor = add(hex, offset)
      candidates.set(key(neighbor), neighbor)
    }
  }
  for (const origin of candidates.values()) {
    if (occupied.has(key(origin)) || safe.has(key(origin))) continue
    const roll = random()
    if (roll >= 0.15) continue
    const water = roll >= 0.10
    const offsets = water ? WATER : BUNKER
    const footprint = offsets.map((offset) => add(origin, offset))
    if (footprint.some((hex) => !grid.getHex(hex) || occupied.has(key(hex)) || safe.has(key(hex)))) continue
    tiles.push({ type: water ? 'water' : 'bunker', origin, rotation: 0 })
    reserve(origin, offsets)
  }
  tiles.push({ type: 'green', origin: green, rotation: 0 })
  return { id: 'generated-hole', par: 4, default_wind: 0, tiles }
}
