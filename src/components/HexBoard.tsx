import { useMemo, useRef, useState, useEffect } from 'react'
import type { ComponentType } from 'react'
import { Stage, Layer, Line, Rect } from 'react-konva'
import { Grid, rectangle } from 'honeycomb-grid'
import Box from '@mui/material/Box'
import { useHexStore } from '../store/hexStore'
import { HexTile } from '../utils/hexGrid'
import type { Hole, HoleTileType } from '../types/hole'
import hole1 from '../data/hole1.json'
import {
  TeePiece, FairwayLinePiece, FairwayFlowerPiece, FairwayDrivePiece,
  FairwayElbow60Piece, FairwayPiece, GreenPiece, BunkerPiece, WaterPiece,
  EvergreenPiece, DeciduousPiece,
} from './tiles'

const PIECES = {
  tee: TeePiece,
  'fairway-line': FairwayLinePiece,
  'fairway-flower': FairwayFlowerPiece,
  'fairway-drive': FairwayDrivePiece,
  'fairway-short': (props) => <FairwayPiece {...props} shape="short" />,
  'fairway-elbow-60': FairwayElbow60Piece,
  fairway: FairwayPiece,
  green: GreenPiece,
  bunker: BunkerPiece,
  water: WaterPiece,
  evergreen: EvergreenPiece,
  deciduous: DeciduousPiece,
} satisfies Record<HoleTileType, ComponentType<{ origin: { q: number; r: number }; rotation: number }>>

const DEFAULT_HOLE = hole1 as Hole

const GRID_COLS = 80
const GRID_ROWS = 60

const ROUGH_FILL = '#5C7A2E'
const ROUGH_STROKE = '#3D5E1A'
const BALL_COLOR = '#FFFFFF'
const BALL_STROKE = '#000000'

export default function HexBoard({ hole = DEFAULT_HOLE }: { hole?: Hole }) {
  const ballQ = useHexStore((s) => s.ballQ)
  const ballR = useHexStore((s) => s.ballR)
  const setBallPosition = useHexStore((s) => s.setBallPosition)

  useEffect(() => {
    const tee = hole.tiles.find((tile) => tile.type === 'tee')
    if (tee) setBallPosition(tee.origin.q, tee.origin.r)
  }, [hole, setBallPosition])

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
            return (
              <Line
                key={`${hex.q},${hex.r}`}
                points={points}
                closed
                fill={ROUGH_FILL}
                stroke={ROUGH_STROKE}
                strokeWidth={1}
              />
            )
          })}
          {hole.tiles.map((tile, index) => {
            const Piece = PIECES[tile.type]
            return <Piece key={index} origin={tile.origin} rotation={tile.rotation} />
          })}
          {hexes.filter((hex) => hex.q === ballQ && hex.r === ballR).map((hex) => (
            <Line
              key="ball"
              points={hex.corners.flatMap((corner) => [corner.x, corner.y])}
              closed
              fill={BALL_COLOR}
              stroke={BALL_STROKE}
              strokeWidth={1}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  )
}
