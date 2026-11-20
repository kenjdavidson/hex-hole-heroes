export type HoleTileType =
  | 'tee'
  | 'fairway-line'
  | 'fairway-flower'
  | 'fairway-drive'
  | 'fairway-short'
  | 'fairway-elbow-60'
  | 'fairway'
  | 'green'
  | 'bunker'
  | 'water'
  | 'evergreen'
  | 'deciduous'

export interface HoleTile {
  type: HoleTileType
  origin: { q: number; r: number }
  rotation: number
}

export interface Hole {
  id: string
  par: number
  default_wind: number
  tiles: HoleTile[]
}
