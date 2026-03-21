import Box from '@mui/material/Box'
import HexBoard from '../components/HexBoard'

export default function HomePage() {
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <HexBoard />
    </Box>
  )
}
