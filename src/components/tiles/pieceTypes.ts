/** Axial hex coordinate offset relative to a piece's origin. */
export interface HexOffset {
  dq: number
  dr: number
}

/** Props shared by every piece component. */
export interface PieceProps {
  /** Axial (q, r) coordinates of the origin hex on the board. */
  origin: { q: number; r: number }
  /** Clockwise rotation in degrees around the origin hex center. */
  rotation?: number
}
