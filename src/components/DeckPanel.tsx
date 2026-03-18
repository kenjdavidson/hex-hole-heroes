import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import ClubCard from './ClubCard'

/** How many px each card slides under the previous one */
const CARD_OVERLAP = 18

export default function DeckPanel() {
  const clubs = useSelector(selectAllClubs)

  return (
    <Box sx={{ p: 2, pb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Bag
      </Typography>
      <Box sx={{ display: 'flex', position: 'relative', pt: 1.5 }}>
        {clubs.map((club, idx) => (
          <Box
            key={club.id}
            sx={{
              ml: idx === 0 ? 0 : `-${CARD_OVERLAP}px`,
              position: 'relative',
              zIndex: idx + 1,
              '&:hover': { zIndex: 100 },
              '&:focus-within': { zIndex: 100 },
            }}
          >
            <ClubCard club={club} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
