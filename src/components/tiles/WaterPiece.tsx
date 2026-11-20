import TerrainPiece from './TerrainPiece'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'
import { hazardDimension, hazardOffsets, HazardShape } from './terrainShapes'
import { WATER } from './terrainOffsets'

/** Three hexes in a compact triangle; origin is the "top-left" hex. */
const OFFSETS = WATER

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
