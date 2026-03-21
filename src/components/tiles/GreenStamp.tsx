import { Group, Line, Circle } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { StampProps } from './stampTypes'

const GREEN_FILL = '#7CFC00'
const GREEN_STROKE = '#4CAF50'
const PIN_FILL = '#FFFFFF'
const PIN_STROKE = '#000000'
const PIN_RADIUS = 3

/**
 * Mega-Flower: center + ring 1 (6 hexes) + ring 2 (12 hexes) = 19 hexes.
 * The origin hex (0,0) is the pin/hole position.
 */
const OFFSETS = [
  // Center — the pin
  { dq: 0, dr: 0 },
  // Ring 1: immediate neighbors
  { dq: 1, dr: 0 },
  { dq: 1, dr: -1 },
  { dq: 0, dr: -1 },
  { dq: -1, dr: 0 },
  { dq: -1, dr: 1 },
  { dq: 0, dr: 1 },
  // Ring 2: hexes at axial distance 2
  { dq: 2, dr: 0 },
  { dq: 2, dr: -1 },
  { dq: 2, dr: -2 },
  { dq: 1, dr: -2 },
  { dq: 0, dr: -2 },
  { dq: -1, dr: -1 },
  { dq: -2, dr: 0 },
  { dq: -2, dr: 1 },
  { dq: -2, dr: 2 },
  { dq: -1, dr: 2 },
  { dq: 0, dr: 2 },
  { dq: 1, dr: 1 },
]

export default function GreenStamp({ origin, rotation = 0 }: StampProps) {
  const { x, y } = getHexCenter(origin.q, origin.r)

  return (
    <Group x={x} y={y} rotation={rotation}>
      {OFFSETS.map(({ dq, dr }) => {
        const hex = new HexTile({ q: origin.q + dq, r: origin.r + dr })
        const points = hex.corners.flatMap((c) => [c.x - x, c.y - y])
        return (
          <Line
            key={`${dq},${dr}`}
            points={points}
            closed
            fill={GREEN_FILL}
            stroke={GREEN_STROKE}
            strokeWidth={1}
          />
        )
      })}
      {/* Pin / hole marker at the origin hex centre (isHole position) */}
      <Circle
        x={0}
        y={0}
        radius={PIN_RADIUS}
        fill={PIN_FILL}
        stroke={PIN_STROKE}
        strokeWidth={1}
      />
    </Group>
  )
}
