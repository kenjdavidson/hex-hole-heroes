import type { Golfer } from './player'
import type { Club } from './club'

export interface Game {
  id: number
  golfer: Golfer
  clubs: Club[]
  holes: number
}
