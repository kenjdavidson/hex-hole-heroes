import { useMemo, useRef, useState, useEffect } from 'react'
import { Stage, Layer, Line, Rect } from 'react-konva'
import { Grid, rectangle } from 'honeycomb-grid'
import Box from '@mui/material/Box'
import { useHexStore } from '../store/hexStore'
import { HexTile } from '../utils/hexGrid'

const GRID_COLS = 80
const GRID_ROWS = 60

const ROUGH_FILL = '#5C7A2E'
const ROUGH_STROKE = '#3D5E1A'
const BALL_COLOR = '#FFFFFF'
const BALL_STROKE = '#000000'

export default function HexBoard() {
  const ballQ = useHexStore((s) => s.ballQ)
  const ballR = useHexStore((s) => s.ballR)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      if (!entries.length) return
      const { width, height } = entries[0].contentRect
      setContainerSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { hexes, stageWidth, stageHeight } = useMemo(() => {
    const grid = new Grid(HexTile, rectangle({ width: GRID_COLS, height: GRID_ROWS }))
    return {
      hexes: grid.toArray(),
      stageWidth: Math.ceil(grid.pixelWidth),
      stageHeight: Math.ceil(grid.pixelHeight),
    }
  }, [])

  const displayWidth = containerSize.width || stageWidth
  const displayHeight = containerSize.height || stageHeight
  const scaleX = stageWidth > 0 ? displayWidth / stageWidth : 1
  const scaleY = stageHeight > 0 ? displayHeight / stageHeight : 1

  return (
    <Box ref={containerRef} sx={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <Stage width={displayWidth} height={displayHeight}>
        <Layer scaleX={scaleX} scaleY={scaleY}>
          <Rect x={0} y={0} width={stageWidth} height={stageHeight} fill={ROUGH_FILL} />
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
