import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { StampProps } from './stampTypes'

const FAIRWAY_FILL = '#228B22'
const FAIRWAY_STROKE = '#145214'

/** Three hexes in a straight horizontal axial line; origin is the middle hex. */
const OFFSETS = [
  { dq: -1, dr: 0 },
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
]

export default function FairwayLineStamp({ origin, rotation = 0 }: StampProps) {
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
            fill={FAIRWAY_FILL}
            stroke={FAIRWAY_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
