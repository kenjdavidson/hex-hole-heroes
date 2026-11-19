import TerrainPiece from './TerrainPiece'
import { PieceProps } from './pieceTypes'
import { fairwayOffsets, FairwayShape } from './terrainShapes'
import { TerrainColors } from './terrainColors'

interface FairwayPieceProps extends PieceProps {
  shape?: FairwayShape
}

export default function FairwayPiece({ shape = 'straight', ...props }: FairwayPieceProps) {
  return (
    <TerrainPiece
      {...props}
      offsets={fairwayOffsets(shape)}
      fill={TerrainColors.FAIRWAY_FILL}
      stroke={TerrainColors.FAIRWAY_STROKE}
    />
  )
}
