import Box from '@mui/material/Box'
import HexBoard from '../components/HexBoard'
import { useSelector } from 'react-redux'
import { selectActiveGame } from '../store/game'
import { HOLE_COLS, HOLE_ROWS } from '../services/holeGeneration'

export default function HomePage() {
  const hole = useSelector(selectActiveGame)?.currentHole
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {hole ? <HexBoard hole={hole} columns={HOLE_COLS} rows={HOLE_ROWS} /> : <HexBoard />}
    </Box>
  )
}
