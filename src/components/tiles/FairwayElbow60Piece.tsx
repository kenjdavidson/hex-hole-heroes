import { Group, Line } from 'react-konva'
import { HexTile, getHexCenter, buildElbowOffsets } from '../../utils/hexGrid'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'

/**
 * Convex 60° dogleg fairway piece.
 *
 * Shape: convex hull of two 5-wide arms (armLen=5 hexes each) meeting at a
 * clockwise 60° bend (E → SE direction) = 55 hexes.  The origin hex sits at
 * the bend point so `rotation` spins around the visual centre.
 *
 * Use `rotation` to get any of the six 60° orientations:
 *   - 0°   E → SE  (clockwise dogleg going east then south-east)
 *   - 60°  NE → E
 *   - 120° N → NE
 *   - 180° W → NW  (mirror of 0°)
 *   - 240° SW → W
 *   - 300° SE → S
 */
const OFFSETS = buildElbowOffsets(5, 5)

export default function FairwayElbow60Piece({ origin, rotation = 0 }: PieceProps) {
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
