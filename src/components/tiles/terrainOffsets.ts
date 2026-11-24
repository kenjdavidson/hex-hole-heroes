import type { HexOffset } from './pieceTypes'

export const NEIGHBORS: HexOffset[] = [
  { dq: 1, dr: 0 }, { dq: 1, dr: -1 }, { dq: 0, dr: -1 },
  { dq: -1, dr: 0 }, { dq: -1, dr: 1 }, { dq: 0, dr: 1 },
]

export const FAIRWAY_LINE: HexOffset[] = [
  { dq: -1, dr: 0 }, { dq: 0, dr: 0 }, { dq: 1, dr: 0 },
]
export const FAIRWAY_FLOWER: HexOffset[] = [{ dq: 0, dr: 0 }, ...NEIGHBORS]
export const BUNKER: HexOffset[] = [{ dq: 0, dr: 0 }, { dq: 1, dr: 0 }]
export const WATER: HexOffset[] = [{ dq: 0, dr: 0 }, { dq: 1, dr: 0 }, { dq: 0, dr: 1 }]
