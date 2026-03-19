import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedClubId, selectLastShot, recordShot, clearShot, selectClub } from '../store/shotSlice'
import { selectAllClubs } from '../store/deckSlice'
import { roll2d6, rollD12, getShotResult, getScatterLabel, getPowerLabel } from '../services/DiceService'

export default function ShotOverlay() {
  const dispatch = useDispatch()
  const selectedClubId = useSelector(selectSelectedClubId)
  const lastShot = useSelector(selectLastShot)
  const clubs = useSelector(selectAllClubs)

  const selectedClub = clubs.find((c) => c.id === selectedClubId) ?? null

  if (!selectedClub) return null

  const handleRoll = () => {
    const powerRoll = roll2d6()
    const scatterRoll = selectedClub.scatter > 0 ? rollD12() : 1
    const result = getShotResult(selectedClub, powerRoll, scatterRoll)
    dispatch(recordShot(result))
  }

  const handleRollAgain = () => {
    dispatch(clearShot())
  }

  const handleChangeClub = () => {
    dispatch(selectClub(null))
  }

  const [distMin, distMax] = selectedClub.dist
  const distLabel = distMin === distMax ? `${distMin}` : `${distMin}–${distMax}`

  return (
    <Paper
      elevation={8}
      role="region"
      aria-label="shot overlay"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: 2,
        borderColor: 'divider',
        borderRadius: 0,
        p: 2,
        bgcolor: 'background.paper',
        zIndex: 10,
      }}
    >
      {/* Club info row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
            {selectedClub.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedClub.type} · {distLabel} hex{selectedClub.scatter > 0 ? ` · scatter ${selectedClub.scatter}` : ''}
          </Typography>
        </Box>
        <Button size="small" variant="text" onClick={handleChangeClub} aria-label="change club">
          Change
        </Button>
      </Box>

      {lastShot ? (
        /* Result display */
        <Box>
          <Divider sx={{ mb: 1.5 }} />

          {/* Dice values */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Power (2d6)
              </Typography>
              <Typography variant="h5" fontWeight={900} lineHeight={1}>
                {lastShot.powerRoll}
              </Typography>
            </Box>
            {lastShot.scatterRoll !== null && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Scatter (d12)
                </Typography>
                <Typography variant="h5" fontWeight={900} lineHeight={1}>
                  {lastShot.scatterRoll}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Result chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
            <Chip
              size="small"
              label={`${getPowerLabel(lastShot.powerOffset)} (${lastShot.powerOffset >= 0 ? '+' : ''}${lastShot.powerOffset} hex)`}
              color={lastShot.powerOffset >= 0 ? 'success' : 'warning'}
              aria-label="power result"
            />
            {lastShot.scatterRoll !== null && (
              <Chip
                size="small"
                label={`${getScatterLabel(lastShot.scatterOffset)} (${lastShot.scatterOffset >= 0 ? '+' : ''}${lastShot.scatterOffset} lateral)`}
                color={lastShot.scatterOffset === 0 ? 'success' : 'warning'}
                aria-label="scatter result"
              />
            )}
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<CasinoIcon />}
            onClick={handleRollAgain}
            aria-label="roll again"
          >
            Roll Again
          </Button>
        </Box>
      ) : (
        /* Roll button */
        <Button
          variant="contained"
          fullWidth
          startIcon={<CasinoIcon />}
          onClick={handleRoll}
          aria-label="roll dice"
        >
          Roll Dice
        </Button>
      )}
    </Paper>
  )
}
