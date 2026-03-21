import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter, buildRectOffsets } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'

/** 3×6 = 18 hexes; origin at the hex closest to the visual centre. */
const OFFSETS = buildRectOffsets(3, 6)

export default function TeePiece({ origin, rotation = 0 }: PieceProps) {
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
            fill={TerrainColors.TEE_FILL}
            stroke={TerrainColors.TEE_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
