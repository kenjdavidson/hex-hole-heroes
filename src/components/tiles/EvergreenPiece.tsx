import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'

/**
 * Evergreen / conifer tree cluster — 7-hex flower (center + 6 neighbors).
 * Dark pine green. Used to mark conifer forests on the course.
 */
const OFFSETS = [
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
  { dq: 1, dr: -1 },
  { dq: 0, dr: -1 },
  { dq: -1, dr: 0 },
  { dq: -1, dr: 1 },
  { dq: 0, dr: 1 },
]

export default function EvergreenPiece({ origin, rotation = 0 }: PieceProps) {
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
            fill={TerrainColors.EVERGREEN_FILL}
            stroke={TerrainColors.EVERGREEN_STROKE}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
