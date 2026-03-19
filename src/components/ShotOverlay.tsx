import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedClubId, selectLastShot, recordShot, clearShot, selectClub } from '../store/shotSlice'
import { selectAllClubs } from '../store/deckSlice'
import { roll2d6, rollD12, getShotResult, getScatterLabel, getPowerLabel } from '../services/DiceService'
import { TYPE_COLORS } from './ClubCard'
import type { Club } from '../types/club'

interface SelectedClubCardProps {
  club: Club
}

function SelectedClubCard({ club }: SelectedClubCardProps) {
  const colors = TYPE_COLORS[club.type]
  const [distMin, distMax] = club.dist
  const distLabel = distMin === distMax ? `${distMin}` : `${distMin}–${distMax}`

  return (
    <Box
      sx={{
        borderRadius: 1.5,
        border: `2px solid ${colors.border}`,
        bgcolor: colors.bg,
        overflow: 'hidden',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          px: 1.5,
          pt: 1,
          pb: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: '1.1rem',
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {club.id}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: '0.6rem', color: colors.text, opacity: 0.7, textTransform: 'uppercase' }}
        >
          {club.type}
        </Typography>
      </Box>

      <Box sx={{ mx: 1.5, borderBottom: `1px solid ${colors.border}` }} />

      <Box sx={{ px: 1.5, pt: 0.75 }}>
        <Typography
          component="span"
          sx={{ display: 'block', fontWeight: 600, fontSize: '0.75rem', color: colors.text, mb: 0.5 }}
        >
          {club.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: '1.2rem', color: colors.text, lineHeight: 1 }}
          >
            {distLabel}
          </Typography>
          <Typography component="span" sx={{ fontSize: '0.65rem', color: colors.text, opacity: 0.7 }}>
            hex
          </Typography>
        </Box>
        {club.scatter > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <Typography component="span" sx={{ fontSize: '0.65rem', color: colors.text, opacity: 0.7 }}>
              scatter:
            </Typography>
            <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.75rem', color: colors.text }}>
              {club.scatter}
            </Typography>
          </Box>
        )}
      </Box>

      {club.ability && (
        <>
          <Box sx={{ mx: 1.5, mt: 0.75, borderBottom: `1px solid ${colors.border}`, opacity: 0.5 }} />
          <Box sx={{ px: 1.5, pt: 0.5, pb: 1 }}>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.65rem',
                color: colors.text,
                fontStyle: 'italic',
                lineHeight: 1.35,
              }}
            >
              ★ {club.ability}
            </Typography>
          </Box>
        </>
      )}
      {!club.ability && <Box sx={{ pb: 1 }} />}
    </Box>
  )
}

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

  const handleRollAgain = () => {
    dispatch(clearShot())
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
      <Typography variant="subtitle2" sx={{ pt: 1.5, pb: 1, fontWeight: 700 }}>
        On the Table
      </Typography>

      {!selectedClub ? (
        /* Empty placeholder — no club selected */
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
          }}
          aria-label="club placeholder"
        >
          <Typography variant="caption" color="text.disabled">
            Select a club from your bag
          </Typography>
        </Box>
      ) : (
        /* Selected club card + dice controls */
        <Box>
          <SelectedClubCard club={selectedClub} />

          {/* Return club to bag */}
          <Button
            size="small"
            variant="text"
            onClick={handleReturnToBag}
            aria-label="change club"
            sx={{ mb: 1.5, pl: 0 }}
          >
            ← Return to bag
          </Button>

          <Divider sx={{ mb: 1.5 }} />

          {lastShot ? (
            /* Dice result display */
            <Box>
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
            /* Roll Dice button */
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
      )}
    </Box>
  )
}
