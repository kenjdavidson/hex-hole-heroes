import TerrainPiece from './TerrainPiece'
import { PieceProps } from './pieceTypes'
import { TerrainColors } from './terrainColors'
import { hazardDimension, hazardOffsets, HazardShape } from './terrainShapes'
import { BUNKER } from './terrainOffsets'

/** Two adjacent hexes; origin is the first hex. */
const OFFSETS = BUNKER

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
