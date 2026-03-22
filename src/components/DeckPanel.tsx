import Box from '@mui/material/Box'
import { useRef, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import { selectSelectedGolfer } from '../store/playerSlice'
import { selectClub, selectSelectedClubId } from '../store/shotSlice'
import type { Club } from '../types/club'
import ClubCard, { CARD_WIDTH, CARD_HEIGHT } from './ClubCard'

/** Maximum cards shown in a single row before wrapping to a new row */
const CARDS_PER_ROW = 7
/** Fallback scale used before the container width is first measured */
const FALLBACK_SCALE = 0.48
/** Fallback visual card width (before container is measured) */
const FALLBACK_CARD_WIDTH = Math.round(CARD_WIDTH * FALLBACK_SCALE)   // ~61 px
/** Fraction of card height exposed per vertical row — rows overlap so only the
 *  top portion of each row is visible behind the next row */
const ROW_STEP_Y_RATIO = 0.55
/** Extra bottom padding below the last row */
const CONTAINER_BOTTOM_PAD = 12
/**
 * Z-index stride per row — must be > CARDS_PER_ROW so z-values for cards within
 * a row (1…CARDS_PER_ROW) don't bleed into the next row's range.
 */
const Z_ROW_STRIDE = CARDS_PER_ROW * 2

export default function DeckPanel() {
  const clubs = useSelector(selectAllClubs)
  const selectedClubId = useSelector(selectSelectedClubId)
  const golfer = useSelector(selectSelectedGolfer)
  const dispatch = useDispatch()

  // The selected club is removed from the bag and shown on the table (ShotOverlay)
  const bagClubs = clubs.filter((c) => c.id !== selectedClubId)
  const n = bagClubs.length

  // Measure the container so cards fill the full width
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        setContainerWidth(entries[0].contentRect.width)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Card size is derived from container width: each card occupies 1/CARDS_PER_ROW of the
  // available width so all 7 cards in a row fill the full deck area.
  const { scaledCardWidth, scale, scaledCardHeight, rowStepY } = useMemo(() => {
    const w = containerWidth > 0
      ? Math.floor(containerWidth / CARDS_PER_ROW)
      : FALLBACK_CARD_WIDTH
    const s = w / CARD_WIDTH
    const h = Math.round(CARD_HEIGHT * s)
    return { scaledCardWidth: w, scale: s, scaledCardHeight: h, rowStepY: Math.round(h * ROW_STEP_Y_RATIO) }
  }, [containerWidth])

  // Multi-row layout: at most CARDS_PER_ROW per row, rows overlap vertically
  const numRows = Math.ceil(n / CARDS_PER_ROW)
  const containerHeight = scaledCardHeight + (numRows - 1) * rowStepY + CONTAINER_BOTTOM_PAD

  const handleClubClick = (club: Club) => {
    dispatch(selectClub(club.id))
  }

  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      {/* Bag hand — cards split into rows of CARDS_PER_ROW, rows overlap vertically */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: containerHeight,
        }}
      >
        {bagClubs.map((club, idx) => {
          const rowIdx = Math.floor(idx / CARDS_PER_ROW)
          const posInRow = idx % CARDS_PER_ROW

          // Left-to-right stacking: rightmost card has the highest z-index, like holding cards.
          // Later rows are in front of earlier rows via Z_ROW_STRIDE.
          const zIndex = rowIdx * Z_ROW_STRIDE + posInRow + 1

          const isHovered = hoveredIdx === idx

          return (
            <Box
              key={club.id}
              // Mouse events track the hovered slot directly.
              // Focus/blur bubble up from the inner ClubCard (tabIndex=0),
              // so keyboard navigation triggers the same scale-up effect.
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx(null)}
              sx={{
                position: 'absolute',
                top: rowIdx * rowStepY,
                left: posInRow * scaledCardWidth,
                width: scaledCardWidth,
                height: scaledCardHeight,
                overflow: isHovered ? 'visible' : 'hidden',
                zIndex: isHovered ? numRows * Z_ROW_STRIDE + 10 : zIndex,
              }}
            >
              {/* Inner box scales the full card to fit the dynamic card footprint.
                  On hover the scale grows to 125% so the card is more readable. */}
              <Box
                sx={{
                  transform: `scale(${isHovered ? scale * 1.25 : scale})`,
                  transformOrigin: 'top left',
                  transition: 'transform 0.15s ease',
                }}
              >
                <ClubCard
                  club={club}
                  golfer={golfer}
                  selected={false}
                  onClick={handleClubClick}
                />
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
