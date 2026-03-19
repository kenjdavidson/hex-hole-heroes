import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Button from '@mui/material/Button'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectAvailableGolfers, setSelectedGolfer } from '../store/playerSlice'
import { selectAllClubs } from '../store/deckSlice'
import { startGame } from '../store/gameSlice'
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
        alignItems: 'center',
        gap: 4,
        p: 4,
      }}
    >
      <Typography variant="h4" component="h1" fontWeight="bold">
        New Game
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Choose Your Golfer
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
          }}
        >
          {availableGolfers.map((golfer) => (
            <PlayerCard
              key={golfer.id}
              golfer={golfer}
              selected={selectedGolfer?.id === golfer.id}
              onClick={handleSelectGolfer}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
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

      <Button
        variant="contained"
        size="large"
        onClick={handleStartGame}
        disabled={!selectedGolfer}
        aria-label="start game"
      >
        Start Game
      </Button>
    </Box>
  )
}
