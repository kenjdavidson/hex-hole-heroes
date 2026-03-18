import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

export default function HomePage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
        gap: 2,
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" component="h1" fontWeight="bold">
        Hex Hole Heroes
      </Typography>
      <Typography variant="h6" color="text.secondary">
        A golf-based hexagonal board game
      </Typography>
      <Chip label="Coming Soon" color="primary" size="medium" />
      <Typography variant="body1" color="text.secondary" maxWidth="sm">
        Navigate the hex grid, master the angles, and sink your piece in the
        fewest moves possible. Multiplayer support is on the way!
      </Typography>
    </Box>
  )
}
