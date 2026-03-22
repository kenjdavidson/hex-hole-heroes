import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedClubId, selectLastShot, recordShot, selectClub } from '../store/shotSlice'
import { selectAllClubs } from '../store/deckSlice'
import { selectSelectedGolfer } from '../store/playerSlice'
import { roll2d6, rollD12, getShotResult, getScatterLabel, getPowerLabel } from '../services/DiceService'
import ClubCard, { CARD_WIDTH, CARD_HEIGHT } from './ClubCard'

/** Scale factor for the selected card display (20% larger than full card) */
const SELECTED_CARD_SCALE = 1.2

export default function ShotOverlay() {
  const dispatch = useDispatch()
  const selectedClubId = useSelector(selectSelectedClubId)
  const lastShot = useSelector(selectLastShot)
  const clubs = useSelector(selectAllClubs)
  const golfer = useSelector(selectSelectedGolfer)

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

  const scatterDirection = (offset: number): string | null => {
    if (offset < 0) return `Left ${Math.abs(offset)}`
    if (offset > 0) return `Right ${offset}`
    return null
  }

  const scatterChipLabel = (offset: number): string => {
    const label = getScatterLabel(offset)
    const dir = scatterDirection(offset)
    return dir ? `${label} (${dir})` : label
  }

  return (
    <Box
      role="region"
      aria-label="shot overlay"
      sx={{ px: 2, pb: 2, borderTop: 1, borderColor: 'divider' }}
    >
      {/* Small icon-only back button — no visible text */}
      {selectedClub && (
        <IconButton
          size="small"
          onClick={handleReturnToBag}
          aria-label="change club"
          sx={{ mt: 0.5, mb: 0.5 }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
      )}

      {/* Dashed border container — holds the card and dice controls */}
      <Box
        sx={{
          mt: selectedClub ? 0 : 1.5,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 2,
          p: 2,
          minHeight: Math.round(CARD_HEIGHT * SELECTED_CARD_SCALE) + 32,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!selectedClub ? (
          <Box
            aria-label="club placeholder"
            sx={{
              width: '100%',
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
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
            {/* Card scaled 20% larger, container sized to match visual footprint */}
            <Box
              sx={{
                flexShrink: 0,
                width: Math.round(CARD_WIDTH * SELECTED_CARD_SCALE),
                height: Math.round(CARD_HEIGHT * SELECTED_CARD_SCALE),
                position: 'relative',
              }}
            >
              <Box sx={{ transform: `scale(${SELECTED_CARD_SCALE})`, transformOrigin: 'top left' }}>
                <ClubCard club={selectedClub} golfer={golfer} selected />
              </Box>
            </Box>

            {/* Dice controls */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {lastShot ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: lastShot.scatterRoll !== null ? '1fr 1fr' : '1fr',
                    gap: 2,
                  }}
                >
                  {/* Power column */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Power (2d6)
                    </Typography>
                    <Typography variant="h5" fontWeight={900} lineHeight={1}>
                      {lastShot.powerRoll}
                    </Typography>
                    <Chip
                      size="small"
                      label={`${getPowerLabel(lastShot.powerOffset)} (${lastShot.powerOffset >= 0 ? '+' : ''}${lastShot.powerOffset} hex)`}
                      color={lastShot.powerOffset >= 0 ? 'success' : 'warning'}
                      aria-label="power result"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>

                  {/* Scatter column */}
                  {lastShot.scatterRoll !== null && (
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Scatter (d12)
                      </Typography>
                      <Typography variant="h5" fontWeight={900} lineHeight={1}>
                        {lastShot.scatterRoll}
                      </Typography>
                      <Chip
                        size="small"
                        label={scatterChipLabel(lastShot.scatterOffset)}
                        color={lastShot.scatterOffset === 0 ? 'success' : 'warning'}
                        aria-label="scatter result"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  )}
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
