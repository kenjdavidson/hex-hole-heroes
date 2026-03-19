import Box from '@mui/material/Box'
import { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import { selectSelectedGolfer } from '../store/playerSlice'
import { selectClub, selectSelectedClubId } from '../store/shotSlice'
import type { Club } from '../types/club'
import ClubCard, { CARD_WIDTH, CARD_HEIGHT } from './ClubCard'

/** Scale factor applied to the full card for the bag hand */
const SCALE = 0.4
/** Visual dimensions of a scaled card */
const SCALED_CARD_WIDTH = Math.round(CARD_WIDTH * SCALE)   // 51 px
const SCALED_CARD_HEIGHT = Math.round(CARD_HEIGHT * SCALE)  // 72 px

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

  // Spread cards evenly; fall back to a compact default before first measure
  const cardStep = n > 1 && containerWidth > SCALED_CARD_WIDTH
    ? (containerWidth - SCALED_CARD_WIDTH) / (n - 1)
    : 24

  const handleClubClick = (club: Club) => {
    dispatch(selectClub(club.id))
  }

  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      {/* Horizontal hand — cards spread across the full container width */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: SCALED_CARD_HEIGHT + 12,
        }}
      >
        {bagClubs.map((club, idx) => {
          const center = (n - 1) / 2
          const zIndex = Math.max(1, n - Math.round(Math.abs(idx - center)))

          return (
            <Box
              key={club.id}
              sx={{
                position: 'absolute',
                top: 0,
                left: idx * cardStep,
                width: SCALED_CARD_WIDTH,
                height: SCALED_CARD_HEIGHT,
                overflow: 'hidden',
                zIndex,
                transition: 'transform 0.15s ease',
                '&:hover': {
                  zIndex: n + 10,
                  transform: 'translateY(-8px)',
                },
                '&:focus-within': {
                  zIndex: n + 10,
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
