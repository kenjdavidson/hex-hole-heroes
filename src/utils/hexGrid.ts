import { defineHex, Orientation } from 'honeycomb-grid'

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
