import TerrainPiece from './TerrainPiece'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'
import { hazardDimension, hazardOffsets, HazardShape } from './terrainShapes'

/** Three hexes in a compact triangle; origin is the "top-left" hex. */
const OFFSETS = [
  { dq: 0, dr: 0 },
  { dq: 1, dr: 0 },
  { dq: 0, dr: 1 },
]

interface WaterPieceProps extends PieceProps {
  shape?: HazardShape
  width?: number
  height?: number
}

export default function WaterPiece({ shape, width, height, ...props }: WaterPieceProps) {
  return (
    <TerrainPiece
      {...props}
      offsets={shape || width !== undefined || height !== undefined
        ? hazardOffsets(shape ?? 'rectangle', hazardDimension(width, 6), hazardDimension(height, 2))
        : OFFSETS}
      fill={TerrainColors.WATER_FILL}
      stroke={TerrainColors.WATER_STROKE}
    />
  )
}
