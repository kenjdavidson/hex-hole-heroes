export type ClubType = 'Wood' | 'Iron' | 'Wedge' | 'Putter'

export interface Club {
  id: string
  name: string
  type: ClubType
  /** [min, max] hex distance */
  dist: [number, number]
  /** Number of scatter dice (0 = no scatter) */
  scatter: number
  /** Special ability text, or null if none */
  ability: string | null
}

export interface Deck {
  version: string
  starting_bag: Club[]
}
