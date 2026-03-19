import type { Club, ClubType } from '../types/club'
import type { ShotResult } from '../types/shot'

/**
 * Power table for Wood clubs (2d6 → hex distance offset).
 * Roll 7 = Standard (no adjustment); based on RULES.md Wood Power Table.
 */
export const WOOD_POWER_TABLE: Readonly<Record<number, number>> = {
  2: -6,
  3: -4,
  4: -3,
  5: -2,
  6: -1,
  7: 0,
  8: 1,
  9: 2,
  10: 3,
  11: 4,
  12: 6,
}

/**
 * Power table for Iron / Wedge / Putter clubs (2d6 → hex distance offset).
 * Irons are more consistent — range is tighter than Woods.
 */
export const IRON_POWER_TABLE: Readonly<Record<number, number>> = {
  2: -3,
  3: -2,
  4: -1,
  5: -1,
  6: 0,
  7: 0,
  8: 0,
  9: 1,
  10: 1,
  11: 2,
  12: 3,
}

/**
 * Scatter table (d12 → lateral hex offset).
 * Negative = left (hook/draw); positive = right (fade/slice).
 * Based on RULES.md Scatter Table. Roll 11 = Slice / +2 hexes right.
 */
export const SCATTER_TABLE: Readonly<Record<number, number>> = {
  1: -3,
  2: -2,
  3: -2,
  4: -1,
  5: -1,
  6: 0,
  7: 0,
  8: 1,
  9: 1,
  10: 1,
  11: 2,
  12: 3,
}

/** Human-readable label for a lateral scatter offset. */
export function getScatterLabel(offset: number): string {
  if (offset <= -3) return 'Heavy Hook'
  if (offset === -2) return 'Hook'
  if (offset === -1) return 'Draw'
  if (offset === 0) return 'Straight'
  if (offset === 1) return 'Fade'
  if (offset === 2) return 'Slice'
  return 'Shank'
}

/** Human-readable label for a power offset. */
export function getPowerLabel(offset: number): string {
  if (offset <= -4) return 'Dub'
  if (offset === -3) return 'Flub'
  if (offset <= -1) return 'Short'
  if (offset === 0) return 'Standard'
  if (offset <= 2) return 'Long'
  if (offset <= 4) return 'Big Drive'
  return 'Bomb'
}

/** Returns the power table to use for the given club type. */
function getPowerTable(clubType: ClubType): Readonly<Record<number, number>> {
  return clubType === 'Wood' ? WOOD_POWER_TABLE : IRON_POWER_TABLE
}

/** Roll two six-sided dice and return their sum (range: 2–12). */
export function roll2d6(): number {
  return (
    Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1
  )
}

/** Roll a single twelve-sided die and return the result (range: 1–12). */
export function rollD12(): number {
  return Math.floor(Math.random() * 12) + 1
}

/**
 * Compute the full shot result for the given club and dice rolls.
 *
 * @param club        - The club used for the shot
 * @param powerRoll   - Sum of 2d6 (2–12), e.g. from roll2d6()
 * @param scatterRoll - Result of d12 (1–12), e.g. from rollD12().
 *                      Ignored (offset = 0) when club.scatter === 0.
 */
export function getShotResult(
  club: Club,
  powerRoll: number,
  scatterRoll: number,
): ShotResult {
  const table = getPowerTable(club.type)
  const powerOffset = table[powerRoll] ?? 0
  const hasScatter = club.scatter > 0
  const scatterOffset = hasScatter ? (SCATTER_TABLE[scatterRoll] ?? 0) : 0

  return {
    clubId: club.id,
    powerRoll,
    scatterRoll: hasScatter ? scatterRoll : null,
    powerOffset,
    scatterOffset,
  }
}
