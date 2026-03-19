import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import { selectClub, selectSelectedClubId } from '../store/shotSlice'
import type { Club } from '../types/club'
import ClubCard, { MINI_CARD_WIDTH, MINI_CARD_HEIGHT } from './ClubCard'

/** Horizontal step between card left edges — remainder of card width is hidden under the next card */
const CARD_STEP = 22

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
      {/* Horizontal overlapping hand — each card offset by CARD_STEP, hover lifts the card */}
      <Box
        sx={{
          position: 'relative',
          height: MINI_CARD_HEIGHT + 12,
          width: n > 0 ? MINI_CARD_WIDTH + (n - 1) * CARD_STEP : MINI_CARD_WIDTH,
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
              <ClubCard
                club={club}
                selected={false}
                mini
                onClick={handleClubClick}
              />
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
