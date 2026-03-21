import { defineHex, Grid, Orientation, rectangle } from 'honeycomb-grid'

export const APOTHEM = 7
export const CIRCUMRADIUS = (APOTHEM * 2) / Math.sqrt(3)

export const HexTile = defineHex({
  dimensions: { xRadius: CIRCUMRADIUS, yRadius: CIRCUMRADIUS },
  orientation: Orientation.POINTY,
  origin: 'topLeft',
})

/** Returns the pixel center {x, y} of the hex at axial coordinates (q, r). */
export function getHexCenter(q: number, r: number): { x: number; y: number } {
  const hex = new HexTile({ q, r })
  return { x: hex.x, y: hex.y }
}

/**
 * Precomputes (dq, dr) axial offsets for a rectangular arrangement of hexes.
 * The reference "origin" hex is the one closest to the pixel centroid of the
 * rectangle, so that `rotation` in a Konva Group spins around the visual centre.
 */
export function buildRectOffsets(
  width: number,
  height: number,
): Array<{ dq: number; dr: number }> {
  const grid = new Grid(HexTile, rectangle({ width, height }))
  const hexes = grid.toArray()
  const cx = hexes.reduce((s, h) => s + h.x, 0) / hexes.length
  const cy = hexes.reduce((s, h) => s + h.y, 0) / hexes.length
  let center = hexes[0]
  let minD = Infinity
  for (const h of hexes) {
    const d = (h.x - cx) ** 2 + (h.y - cy) ** 2
    if (d < minD) {
      minD = d
      center = h
    }
  }
  return hexes.map((h) => ({ dq: h.q - center.q, dr: h.r - center.r }))
}
