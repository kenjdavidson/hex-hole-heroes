import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { StampProps } from './stampTypes'

const TEE_FILL = '#9E9E9E'
const TEE_STROKE = '#616161'

const OFFSETS = [{ dq: 0, dr: 0 }]

export default function TeeStamp({ origin, rotation = 0 }: StampProps) {
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
            fill={TEE_FILL}
            stroke={TEE_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
