import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter } from '../../utils/hexGrid'
import { HexOffset, PieceProps } from './pieceTypes'

interface TerrainPieceProps extends PieceProps {
  offsets: HexOffset[]
  fill: string
  stroke: string
}

export default function TerrainPiece({ origin, rotation = 0, offsets, fill, stroke }: TerrainPieceProps) {
  const { x, y } = getHexCenter(origin.q, origin.r)

  return (
    <Group x={x} y={y} rotation={rotation}>
      {offsets.map(({ dq, dr }) => {
        const hex = new HexTile({ q: origin.q + dq, r: origin.r + dr })
        return (
          <Line
            key={`${dq},${dr}`}
            points={hex.corners.flatMap((corner) => [corner.x - x, corner.y - y])}
            closed
            fill={fill}
            stroke={stroke}
            strokeWidth={1}
          />
        )
      })}
    </Group>
  )
}
