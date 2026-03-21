import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'

/** Three hexes in a compact triangle; origin is the "top-left" hex. */
const OFFSETS = [
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
  { dq: 0, dr: 1 },
]

export default function WaterPiece({ origin, rotation = 0 }: PieceProps) {
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
            fill={TerrainColors.WATER_FILL}
            stroke={TerrainColors.WATER_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
