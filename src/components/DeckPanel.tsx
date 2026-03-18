import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { selectAllClubs } from '../store/deckSlice'
import ClubCard from './ClubCard'
import type { ClubType } from '../types/club'

const CLUB_TYPE_ORDER: ClubType[] = ['Wood', 'Iron', 'Wedge', 'Putter']

export default function DeckPanel() {
  const clubs = useSelector(selectAllClubs)

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Bag
      </Typography>
      {CLUB_TYPE_ORDER.map((type) => {
        const clubsOfType = clubs.filter((c) => c.type === type)
        if (clubsOfType.length === 0) return null
        return (
          <Box key={type} sx={{ mb: 1.5 }}>
            <Typography
              variant="overline"
              sx={{ display: 'block', color: 'text.secondary', lineHeight: 1.8 }}
            >
              {type}s
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {clubsOfType.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </Box>
            <Divider sx={{ mt: 1.5 }} />
          </Box>
        )
      })}
    </Box>
  )
}
