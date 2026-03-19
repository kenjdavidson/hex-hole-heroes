import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import { selectSelectedGolfer } from '../store/playerSlice'
import { selectClub, selectSelectedClubId } from '../store/shotSlice'
import type { Club } from '../types/club'
import ClubCard, { MINI_CARD_WIDTH, MINI_CARD_HEIGHT } from './ClubCard'

/** Total arc spread in degrees for the hand layout */
const ARC_DEGREES = 56

export default function DeckPanel() {
  const clubs = useSelector(selectAllClubs)
  const selectedClubId = useSelector(selectSelectedClubId)
  const selectedGolfer = useSelector(selectSelectedGolfer)
  const dispatch = useDispatch()

  // The selected club is removed from the bag and shown on the table (ShotOverlay)
  const bagClubs = clubs.filter((c) => c.id !== selectedClubId)
  const n = bagClubs.length

  const handleClubClick = (club: Club) => {
    dispatch(selectClub(club.id))
  }

  return (
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      {/* Fan/arc hand layout — all cards share the same bottom-center pivot */}
      <Box
        sx={{
          position: 'relative',
          height: MINI_CARD_HEIGHT + 22,
          overflow: 'visible',
        }}
      >
        {bagClubs.map((club, idx) => {
          // t is in [-1, 1]: division by (n-1) is safe because n > 1 in the true branch
          const t = n > 1 ? (idx / (n - 1)) * 2 - 1 : 0
          const angle = t * (ARC_DEGREES / 2)
          const center = (n - 1) / 2
          const zIndex = Math.max(1, n - Math.round(Math.abs(idx - center)))

          return (
            <Box
              key={club.id}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                marginLeft: `-${MINI_CARD_WIDTH / 2}px`,
                transformOrigin: '50% 100%',
                transform: `rotate(${angle}deg)`,
                zIndex,
                transition: 'transform 0.15s ease',
                '&:hover': {
                  zIndex: n + 10,
                  transform: `rotate(${angle}deg) translateY(-15px)`,
                },
                '&:focus-within': {
                  zIndex: n + 10,
                  transform: `rotate(${angle}deg) translateY(-15px)`,
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
