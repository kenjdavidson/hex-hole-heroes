import TerrainPiece from './TerrainPiece'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'
import { hazardDimension, hazardOffsets, HazardShape } from './terrainShapes'

/** Two adjacent hexes; origin is the first hex. */
const OFFSETS = [
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
]

interface BunkerPieceProps extends PieceProps {
  shape?: HazardShape
  width?: number
  height?: number
}

export default function BunkerPiece({ shape, width, height, ...props }: BunkerPieceProps) {
  return (
    <TerrainPiece
      {...props}
      offsets={shape || width !== undefined || height !== undefined
        ? hazardOffsets(shape ?? 'rectangle', hazardDimension(width, 2), hazardDimension(height, 2))
        : OFFSETS}
      fill={TerrainColors.SAND_FILL}
      stroke={TerrainColors.SAND_STROKE}
    />
  )
}
