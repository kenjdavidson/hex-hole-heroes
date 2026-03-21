import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter, buildRectOffsets } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'

/**
 * 16×5 = 80 hexes; origin at the visual centre.
 * Two blocks placed end-to-end cover a Par 4 (~32 hex length).
 * Three blocks cover a Par 5 (~48 hex length).
 */
const OFFSETS = buildRectOffsets(16, 5)

export default function FairwayDrivePiece({ origin, rotation = 0 }: PieceProps) {
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
            fill={TerrainColors.FAIRWAY_FILL}
            stroke={TerrainColors.FAIRWAY_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
