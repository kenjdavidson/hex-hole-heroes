import { useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectAvailableGolfers, setSelectedGolfer } from '../store/playerSlice'
import { selectAllClubs } from '../store/deckSlice'
import { startGame } from '../store/game'
import type { Golfer } from '../types/player'
import PlayerCard from '../components/PlayerCard'

export default function NewGamePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const availableGolfers = useSelector(selectAvailableGolfers)
  const clubs = useSelector(selectAllClubs)

  const [selectedGolfer, setLocalGolfer] = useState<Golfer | null>(null)
  const [holes, setHoles] = useState<9 | 18>(9)

  const handleSelectGolfer = (golfer: Golfer) => {
    setLocalGolfer(golfer)
  }

  const handleHolesChange = (
    _: React.MouseEvent<HTMLElement>,
    value: 9 | 18 | null,
  ) => {
    if (value !== null) setHoles(value)
  }

  const handleStartGame = () => {
    if (!selectedGolfer) return
    dispatch(setSelectedGolfer(selectedGolfer))
    dispatch(startGame({ golfer: selectedGolfer, clubs: [...clubs], holes }))
    navigate('/')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: 4,
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          flexGrow: 1,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          New Game
        </Typography>

        {/* Golfer selection */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Choose Your Golfer
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {availableGolfers.map((golfer) => (
              <PlayerCard
                key={golfer.id}
                golfer={golfer}
                compact
                selected={selectedGolfer?.id === golfer.id}
                onClick={handleSelectGolfer}
              />
            ))}
          </Box>
        </Box>

        {/* Number of holes */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Number of Holes
          </Typography>
          <ToggleButtonGroup
            value={holes}
            exclusive
            onChange={handleHolesChange}
            aria-label="number of holes"
          >
            <ToggleButton value={9} aria-label="9 holes">
              9 Holes
            </ToggleButton>
            <ToggleButton value={18} aria-label="18 holes">
              18 Holes
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Create Game at the bottom */}
        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartGame}
            disabled={!selectedGolfer}
            aria-label="create game"
          >
            Create Game
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
