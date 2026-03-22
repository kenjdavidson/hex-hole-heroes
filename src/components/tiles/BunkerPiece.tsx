import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'

/** Two adjacent hexes; origin is the first hex. */
const OFFSETS = [
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
]

export default function BunkerPiece({ origin, rotation = 0 }: PieceProps) {
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
            fill={TerrainColors.SAND_FILL}
            stroke={TerrainColors.SAND_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
