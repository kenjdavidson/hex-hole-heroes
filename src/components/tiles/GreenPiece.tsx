import { Group, Line, Circle } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'
import { fringeOffsets, greenOffsets, GreenShape } from './terrainShapes'

const PIN_RADIUS = 3

interface GreenPieceProps extends PieceProps {
  shape?: GreenShape
}

export default function GreenPiece({ origin, rotation = 0, shape = 'round' }: GreenPieceProps) {
  const { x, y } = getHexCenter(origin.q, origin.r)
  const green = greenOffsets(shape)

  return (
    <Group x={x} y={y} rotation={rotation}>
      {[...fringeOffsets(green).map((offset) => ({ ...offset, fringe: true })),
        ...green.map((offset) => ({ ...offset, fringe: false }))].map(({ dq, dr, fringe }) => {
        const hex = new HexTile({ q: origin.q + dq, r: origin.r + dr })
        const points = hex.corners.flatMap((c) => [c.x - x, c.y - y])
        return (
          <Line
            key={`${dq},${dr}`}
            points={points}
            closed
            fill={fringe ? TerrainColors.FAIRWAY_FILL : TerrainColors.GREEN_FILL}
            stroke={fringe ? TerrainColors.FAIRWAY_STROKE : TerrainColors.GREEN_STROKE}
            strokeWidth={1}
          />
        )
      })}
      {/* Pin / hole marker at the origin hex centre (isHole position) */}
      <Circle
        x={0}
        y={0}
        radius={PIN_RADIUS}
        fill={TerrainColors.PIN_FILL}
        stroke={TerrainColors.PIN_STROKE}
        strokeWidth={1}
      />
    </Group>
  )
}
