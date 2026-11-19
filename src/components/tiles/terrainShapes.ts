import { buildRectOffsets, getHexCenter } from '../../utils/hexGrid'
import { HexOffset } from './pieceTypes'

export type FairwayShape = 'straight' | 'short' | 'long' | 'dogleg-left' | 'dogleg-right' | 'split'
export type GreenShape = 'round' | 'square' | 'oval' | 'long' | 'bean' | 'flower'
export type HazardShape = 'rectangle' | 'flower' | 'bean'

const neighbors: HexOffset[] = [
  { dq: 1, dr: 0 }, { dq: 1, dr: -1 }, { dq: 0, dr: -1 },
  { dq: -1, dr: 0 }, { dq: -1, dr: 1 }, { dq: 0, dr: 1 },
]

function unique(offsets: HexOffset[]): HexOffset[] {
  return [...new Map(offsets.map((offset) => [`${offset.dq},${offset.dr}`, offset])).values()]
}

function centered(offsets: HexOffset[]): HexOffset[] {
  const centers = offsets.map(({ dq, dr }) => getHexCenter(dq, dr))
  const x = centers.reduce((sum, center) => sum + center.x, 0) / centers.length
  const y = centers.reduce((sum, center) => sum + center.y, 0) / centers.length
  const index = centers.reduce((best, center, i) =>
    (center.x - x) ** 2 + (center.y - y) ** 2 <
    (centers[best].x - x) ** 2 + (centers[best].y - y) ** 2 ? i : best, 0)
  const origin = offsets[index]
  return offsets.map(({ dq, dr }) => ({ dq: dq - origin.dq, dr: dr - origin.dr }))
}

export function fairwayOffsets(shape: FairwayShape): HexOffset[] {
  if (shape === 'straight') return buildRectOffsets(20, 6)
  if (shape === 'short') return buildRectOffsets(10, 6)
  if (shape === 'long') return buildRectOffsets(12, 6)

  const arm = buildRectOffsets(shape === 'split' ? 10 : 12, 6)
  if (shape === 'split') {
    return centered([...arm, ...arm.map(({ dq, dr }) => ({ dq: dq - 4, dr: dr + 8 }))])
  }
  const end = Math.max(...arm.map(({ dq }) => dq))
  const second = buildRectOffsets(10, 6).map(({ dq, dr }) => {
    // Rotate the second arm on the hex lattice, then attach it at the first arm's end.
    const q = dq + 5
    return shape === 'dogleg-right'
      ? { dq: end - dr, dr: q + dr }
      : { dq: end + q + dr, dr: -q }
  })
  return centered(unique([...arm, ...second]))
}

const round = (): HexOffset[] => {
  const offsets: HexOffset[] = []
  for (let dq = -2; dq <= 2; dq++) {
    for (let dr = -2; dr <= 2; dr++) {
      if (Math.abs(dq + dr) <= 2) offsets.push({ dq, dr })
    }
  }
  return offsets
}

export function greenOffsets(shape: GreenShape): HexOffset[] {
  switch (shape) {
    case 'round': return round()
    case 'square': return buildRectOffsets(5, 5)
    case 'oval': return buildRectOffsets(6, 4)
    case 'long': return buildRectOffsets(7, 3)
    case 'bean': return round().filter(({ dq, dr }) => !(dq === 2 && dr === -1) && !(dq === 1 && dr === -1))
    case 'flower': return [{ dq: 0, dr: 0 }, ...neighbors]
  }
}

export function fringeOffsets(green: HexOffset[]): HexOffset[] {
  const occupied = new Set(green.map(({ dq, dr }) => `${dq},${dr}`))
  return unique(green.flatMap(({ dq, dr }) =>
    neighbors.map((neighbor) => ({ dq: dq + neighbor.dq, dr: dr + neighbor.dr })),
  )).filter(({ dq, dr }) => !occupied.has(`${dq},${dr}`))
}

export function hazardOffsets(shape: HazardShape, width: number, height: number): HexOffset[] {
  if (shape === 'flower') return [{ dq: 0, dr: 0 }, ...neighbors]
  const rect = buildRectOffsets(width, height)
  if (shape === 'rectangle' || width < 3 || height < 2) return rect
  const top = Math.min(...rect.map(({ dr }) => dr))
  const right = Math.max(...rect.filter(({ dr }) => dr === top).map(({ dq }) => dq))
  return rect.filter(({ dq, dr }) => !(dq === right && dr === top))
}

export function hazardDimension(value: number | undefined, fallback: number): number {
  return value !== undefined && Number.isSafeInteger(value) && value > 0 ? value : fallback
}
