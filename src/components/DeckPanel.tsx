import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import { selectClub, selectSelectedClubId } from '../store/shotSlice'
import type { Club } from '../types/club'
import ClubCard, { CARD_WIDTH, CARD_HEIGHT } from './ClubCard'

/** Scale factor applied to the full card for the bag hand */
const SCALE = 0.4
/** Visual dimensions of a scaled card */
const SCALED_CARD_WIDTH = Math.round(CARD_WIDTH * SCALE)   // 51 px
const SCALED_CARD_HEIGHT = Math.round(CARD_HEIGHT * SCALE)  // 72 px
/** Horizontal step between card left edges — keeps all cards visible */
const CARD_STEP = 24

export default function DeckPanel() {
  const clubs = useSelector(selectAllClubs)
  const selectedClubId = useSelector(selectSelectedClubId)
  const dispatch = useDispatch()

  // The selected club is removed from the bag and shown on the table (ShotOverlay)
  const bagClubs = clubs.filter((c) => c.id !== selectedClubId)
  const n = bagClubs.length

  const handleClubClick = (club: Club) => {
    dispatch(selectClub(club.id))
  }

  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      {/* Horizontal overlapping hand — each full card scaled down and offset by CARD_STEP */}
      <Box
        sx={{
          position: 'relative',
          height: SCALED_CARD_HEIGHT + 12,
          width: n > 0 ? SCALED_CARD_WIDTH + (n - 1) * CARD_STEP : SCALED_CARD_WIDTH,
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
                left: idx * CARD_STEP,
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
