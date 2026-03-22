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

// ---------- convex-hull helpers (private) ----------

function _cross(
  O: [number, number],
  A: [number, number],
  B: [number, number],
): number {
  return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0])
}

function _convexHull(pts: [number, number][]): [number, number][] {
  const sorted = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const lo: [number, number][] = []
  const hi: [number, number][] = []
  for (const p of sorted) {
    while (lo.length >= 2 && _cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0)
      lo.pop()
    lo.push(p)
  }
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i]
    while (hi.length >= 2 && _cross(hi[hi.length - 2], hi[hi.length - 1], p) <= 0)
      hi.pop()
    hi.push(p)
  }
  lo.pop()
  hi.pop()
  return [...lo, ...hi]
}

function _inHull(
  hull: [number, number][],
  pt: [number, number],
  tol = 1e-9,
): boolean {
  for (let i = 0; i < hull.length; i++) {
    if (_cross(hull[i], hull[(i + 1) % hull.length], pt) < -tol) return false
  }
  return true
}

function _hexPixel(q: number, r: number): [number, number] {
  const h = new HexTile({ q, r })
  return [h.x, h.y]
}

/**
 * Precomputes (dq, dr) axial offsets for a convex 60° elbow shape.
 *
 * The elbow has two arms meeting at a clockwise 60° bend (E → SE direction):
 *   - E arm:  q ∈ [-armLen, 0],   r ∈ [-half, half]
 *   - SE arm: q ∈ [-half, half],  r ∈ [0, armLen]
 *
 * The CONVEX HULL of the union of both arms is computed in pixel space, then
 * every hex whose centre falls inside that hull is included. This guarantees
 * the outer boundary has NO concave sections.
 *
 * `rotation` on a Konva Group rotates around the origin hex (closest to the
 * pixel centroid), so all six 60° dogleg orientations are available via a
 * single stamp with different `rotation` values.
 */
export function buildElbowOffsets(
  armLen: number,
  armWidth: number,
): Array<{ dq: number; dr: number }> {
  const half = Math.floor(armWidth / 2)

  // Seed set: union of E arm and SE arm
  const seed = new Set<string>()
  for (let q = -armLen; q <= 0; q++)
    for (let r = -half; r <= half; r++) seed.add(`${q},${r}`)
  for (let q = -half; q <= half; q++)
    for (let r = 0; r <= armLen; r++) seed.add(`${q},${r}`)

  const seedHexes = [...seed].map((s) => s.split(',').map(Number) as [number, number])

  // Convex hull in pixel space
  const hull = _convexHull(seedHexes.map(([q, r]) => _hexPixel(q, r)))

  // Collect all hexes whose centre is inside the hull
  const result: Array<[number, number]> = []
  for (let q = -armLen - 2; q <= armLen + 2; q++)
    for (let r = -armLen - 2; r <= armLen + 2; r++)
      if (_inHull(hull, _hexPixel(q, r))) result.push([q, r])

  // Find hex closest to pixel centroid (becomes the origin / rotation point)
  const cx = result.reduce((s, [q, r]) => s + _hexPixel(q, r)[0], 0) / result.length
  const cy = result.reduce((s, [q, r]) => s + _hexPixel(q, r)[1], 0) / result.length
  let center = result[0]
  let minD = Infinity
  for (const [q, r] of result) {
    const [px, py] = _hexPixel(q, r)
    const d = (px - cx) ** 2 + (py - cy) ** 2
    if (d < minD) {
      minD = d
      center = [q, r]
    }
  }

  return result.map(([q, r]) => ({ dq: q - center[0], dr: r - center[1] }))
}
