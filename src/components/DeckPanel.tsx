import Box from '@mui/material/Box'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import { selectSelectedGolfer } from '../store/playerSlice'
import { selectClub, selectSelectedClubId } from '../store/shotSlice'
import type { Club } from '../types/club'
import ClubCard, { CARD_WIDTH, CARD_HEIGHT } from './ClubCard'

/** Scale factor applied to the full card for the bag hand (20% larger than original 0.4) */
const SCALE = 0.48
/** Visual dimensions of a scaled card */
const SCALED_CARD_WIDTH = Math.round(CARD_WIDTH * SCALE)   // ~61 px
const SCALED_CARD_HEIGHT = Math.round(CARD_HEIGHT * SCALE)  // ~86 px

/** Maximum step between cards within a row to keep them nicely overlapped */
const MAX_CARD_STEP = Math.round(SCALED_CARD_WIDTH * 0.55) // ~34 px
/** Fallback step when container width is not yet measured */
const DEFAULT_CARD_STEP = 24
/** Maximum cards shown in a single row before wrapping to a new row */
const CARDS_PER_ROW = 7
/** Vertical distance between rows — rows overlap so only the top portion of each row is exposed */
const ROW_STEP_Y = Math.round(SCALED_CARD_HEIGHT * 0.55)   // ~47 px
/** Extra bottom padding below the last row */
const CONTAINER_BOTTOM_PAD = 12
/**
 * Z-index multiplier per row — must be > CARDS_PER_ROW so each row's fan z-values
 * (1…CARDS_PER_ROW) don't bleed into the next row's range.
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

  // Measure the container so cards spread across the full width
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
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

  // Multi-row layout: at most CARDS_PER_ROW per row, rows overlap vertically
  const numRows = Math.ceil(n / CARDS_PER_ROW)
  const containerHeight = SCALED_CARD_HEIGHT + (numRows - 1) * ROW_STEP_Y + CONTAINER_BOTTOM_PAD

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
          const cardsInRow = Math.min(CARDS_PER_ROW, n - rowIdx * CARDS_PER_ROW)

          // Horizontal step for this row: spread to fill width, capped at MAX_CARD_STEP
          const rowSpread =
            cardsInRow > 1 && containerWidth > SCALED_CARD_WIDTH
              ? (containerWidth - SCALED_CARD_WIDTH) / (cardsInRow - 1)
              : DEFAULT_CARD_STEP
          const rowStep = Math.min(rowSpread, MAX_CARD_STEP)

          // Center cards in the row have higher z-index (fan effect); later rows are in front
          const rowCenter = (cardsInRow - 1) / 2
          const fanZ = Math.max(1, cardsInRow - Math.round(Math.abs(posInRow - rowCenter)))
          const zIndex = rowIdx * Z_ROW_STRIDE + fanZ

          return (
            <Box
              key={club.id}
              sx={{
                position: 'absolute',
                top: rowIdx * ROW_STEP_Y,
                left: posInRow * rowStep,
                width: SCALED_CARD_WIDTH,
                height: SCALED_CARD_HEIGHT,
                overflow: 'hidden',
                zIndex,
                transition: 'transform 0.15s ease',
                '&:hover': {
                  zIndex: numRows * Z_ROW_STRIDE + 10,
                  transform: 'translateY(-8px)',
                },
                '&:focus-within': {
                  zIndex: numRows * Z_ROW_STRIDE + 10,
                  transform: 'translateY(-8px)',
                },
              }}
            >
              {/* Inner box scales the full card to fit the SCALED_CARD footprint */}
              <Box sx={{ transform: `scale(${SCALE})`, transformOrigin: 'top left' }}>
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
