import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedClubId, selectLastShot, recordShot, selectClub } from '../store/shotSlice'
import { selectAllClubs } from '../store/deckSlice'
import { roll2d6, rollD12, getShotResult, getScatterLabel, getPowerLabel } from '../services/DiceService'
import ClubCard, { CARD_HEIGHT } from './ClubCard'

export default function ShotOverlay() {
  const dispatch = useDispatch()
  const selectedClubId = useSelector(selectSelectedClubId)
  const lastShot = useSelector(selectLastShot)
  const clubs = useSelector(selectAllClubs)

  const selectedClub = clubs.find((c) => c.id === selectedClubId) ?? null

  const handleRoll = () => {
    if (!selectedClub) return
    const powerRoll = roll2d6()
    const scatterRoll = selectedClub.scatter > 0 ? rollD12() : 1
    const result = getShotResult(selectedClub, powerRoll, scatterRoll)
    dispatch(recordShot(result))
  }

  const handleReturnToBag = () => {
    dispatch(selectClub(null))
  }

  return (
    <Box
      role="region"
      aria-label="shot overlay"
      sx={{ px: 2, pb: 2, borderTop: 1, borderColor: 'divider' }}
    >
      {/* Return to Bag at the top, only when a club is selected */}
      {selectedClub && (
        <Button
          size="small"
          variant="text"
          onClick={handleReturnToBag}
          aria-label="change club"
          sx={{ pl: 0, mt: 1, mb: 0.5, alignSelf: 'flex-start' }}
        >
          ← Return to bag
        </Button>
      )}

      {/* Dashed border container — holds the card and dice controls */}
      <Box
        sx={{
          mt: selectedClub ? 0 : 1.5,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          minHeight: CARD_HEIGHT + 32,
        }}
      >
        {!selectedClub ? (
          <Box
            aria-label="club placeholder"
            sx={{
              height: '100%',
              minHeight: CARD_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center' }}>
              Select a club from your bag
            </Typography>
          </Box>
        ) : (
          /* Two-column layout: card (left) + dice controls (right) inside the border */
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {/* Card at canonical fixed dimensions */}
            <Box sx={{ flexShrink: 0 }}>
              <ClubCard club={selectedClub} selected />
            </Box>

            {/* Dice controls */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {lastShot ? (
                <Box>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
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

                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
                </Box>
              ) : (
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
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
