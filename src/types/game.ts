import type { Golfer } from './player'
import type { Club } from './club'
import type { Hole } from './hole'

export interface Game {
  id: number
  golfer: Golfer
  clubs: Club[]
  holes: number
  currentHole?: Hole
}
