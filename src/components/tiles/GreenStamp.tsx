import { Group, Line, Circle } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { StampProps } from './stampTypes'

const GREEN_FILL = '#7CFC00'
const GREEN_STROKE = '#4CAF50'
const PIN_FILL = '#FFFFFF'
const PIN_STROKE = '#000000'
const PIN_RADIUS = 3

/** Center hex (The Pin) plus six fringe neighbors. */
const OFFSETS = [
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
  { dq: 1, dr: -1 },
  { dq: 0, dr: -1 },
  { dq: -1, dr: 0 },
  { dq: -1, dr: 1 },
  { dq: 0, dr: 1 },
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
      {/* Pin / hole marker at the origin hex centre */}
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
