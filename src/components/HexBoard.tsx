import { useMemo } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { defineHex, Grid, rectangle, Orientation } from 'honeycomb-grid'
import Box from '@mui/material/Box'
import { useHexStore } from '../store/hexStore'

const APOTHEM = 15
const CIRCUMRADIUS = (APOTHEM * 2) / Math.sqrt(3)
const GRID_COLS = 42
const GRID_ROWS = 36

const ROUGH_FILL = '#5C7A2E'
const ROUGH_STROKE = '#3D5E1A'
const BALL_COLOR = '#FFFFFF'
const BALL_STROKE = '#000000'

const HexTile = defineHex({
  dimensions: { xRadius: CIRCUMRADIUS, yRadius: CIRCUMRADIUS },
  orientation: Orientation.POINTY,
  origin: 'topLeft',
})

export default function HexBoard() {
  const ballQ = useHexStore((s) => s.ballQ)
  const ballR = useHexStore((s) => s.ballR)

  const { hexes, stageWidth, stageHeight } = useMemo(() => {
    const grid = new Grid(HexTile, rectangle({ width: GRID_COLS, height: GRID_ROWS }))
    return {
      hexes: grid.toArray(),
      stageWidth: Math.ceil(grid.pixelWidth),
      stageHeight: Math.ceil(grid.pixelHeight),
    }
  }, [])

  return (
    <Box sx={{ overflow: 'auto', width: '100%', height: '100%' }}>
      <Stage width={stageWidth} height={stageHeight}>
        <Layer>
          {hexes.map((hex) => {
            const points = hex.corners.flatMap((c) => [c.x, c.y])
            const isBall = hex.q === ballQ && hex.r === ballR
            return (
              <Line
                key={`${hex.q},${hex.r}`}
                points={points}
                closed
                fill={isBall ? BALL_COLOR : ROUGH_FILL}
                stroke={isBall ? BALL_STROKE : ROUGH_STROKE}
                strokeWidth={1}
              />
            )
          })}
        </Layer>
      </Stage>
    </Box>
  )
}
