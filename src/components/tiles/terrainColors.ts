/**
 * Canonical colour palette for all hex board terrain types.
 *
 * Each entry has a FILL (background) and STROKE (edge) value.
 * Import the specific entries you need rather than the whole object where
 * possible so tree-shaking can eliminate unused values.
 */
export const TerrainColors = {
  // ── Terrain: fairways ────────────────────────────────────────────────────
  /** Main fairway — forest green */
  FAIRWAY_FILL: '#228B22',
  FAIRWAY_STROKE: '#145214',

  // ── Terrain: tee ─────────────────────────────────────────────────────────
  /** Tee box — lighter, brighter green to contrast with fairway */
  TEE_FILL: '#66BB6A',
  TEE_STROKE: '#388E3C',

  // ── Terrain: green ───────────────────────────────────────────────────────
  /** Putting green — lawn green (brightest) */
  GREEN_FILL: '#7CFC00',
  GREEN_STROKE: '#4CAF50',
  /** Pin/hole marker */
  PIN_FILL: '#FFFFFF',
  PIN_STROKE: '#000000',

  // ── Terrain: sand ────────────────────────────────────────────────────────
  /** Bunker / sand trap — golden yellow-brown */
  SAND_FILL: '#C8B400',
  SAND_STROKE: '#8B7500',

  // ── Terrain: water ───────────────────────────────────────────────────────
  /** Water hazard — steel blue/grey-blue */
  WATER_FILL: '#4A90C4',
  WATER_STROKE: '#2C5F8A',

  // ── Terrain: trees ───────────────────────────────────────────────────────
  /** Evergreen / conifer cluster — dark pine green */
  EVERGREEN_FILL: '#1B5E20',
  EVERGREEN_STROKE: '#0D3311',
  /** Deciduous tree cluster — olive / medium green */
  DECIDUOUS_FILL: '#558B2F',
  DECIDUOUS_STROKE: '#33691E',

  // ── Terrain: rough (board background) ────────────────────────────────────
  /** Out-of-fairway rough */
  ROUGH_FILL: '#5C7A2E',
  ROUGH_STROKE: '#3D5E1A',
} as const

export type TerrainColor = (typeof TerrainColors)[keyof typeof TerrainColors]
