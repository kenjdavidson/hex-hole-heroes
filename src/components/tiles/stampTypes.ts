/** Axial hex coordinate offset relative to a stamp's origin. */
export interface HexOffset {
  dq: number
  dr: number
}

/** Props shared by every stamp component. */
export interface StampProps {
  /** Axial (q, r) coordinates of the origin hex on the board. */
  origin: { q: number; r: number }
  /** Clockwise rotation in degrees around the origin hex center. */
  rotation?: number
}
