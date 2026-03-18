import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" fontWeight="bold">
          Hex Hole Heroes
        </Typography>
        <Typography variant="h5" color="text.secondary">
          A golf-based hexagonal board game
        </Typography>
        <Chip label="Coming Soon" color="primary" size="medium" />
        <Typography variant="body1" color="text.secondary" maxWidth="sm">
          Navigate the hex grid, master the angles, and sink your piece in the
          fewest moves possible. Multiplayer support is on the way!
        </Typography>
      </Box>
    </Container>
  )
}
