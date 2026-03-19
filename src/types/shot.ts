export interface ShotResult {
  /** ID of the club used for the shot */
  clubId: string
  /** Sum of two d6 rolls (2–12) */
  powerRoll: number
  /** Result of a d12 roll (1–12), or null when the club has no scatter */
  scatterRoll: number | null
  /** Hex distance modifier from base distance (may be negative) */
  powerOffset: number
  /** Lateral hex offset: negative = left (hook/draw), positive = right (fade/slice) */
  scatterOffset: number
}
