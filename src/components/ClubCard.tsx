import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Club, ClubType } from '../types/club'

interface ClubCardProps {
  club: Club
  selected?: boolean
  onClick?: (club: Club) => void
}

const TYPE_COLORS: Record<ClubType, { bg: string; text: string; border: string }> = {
  Wood: { bg: '#4E342E', text: '#FFCC80', border: '#8D6E63' },
  Iron: { bg: '#37474F', text: '#B0BEC5', border: '#607D8B' },
  Wedge: { bg: '#E65100', text: '#FFF9C4', border: '#F57F17' },
  Putter: { bg: '#1A237E', text: '#C5CAE9', border: '#3949AB' },
}

export default function ClubCard({
  club,
  selected = false,
  onClick,
}: ClubCardProps) {
  const colors = TYPE_COLORS[club.type]
  const [distMin, distMax] = club.dist
  const distLabel = distMin === distMax ? `${distMin}` : `${distMin}–${distMax}`

  const handleClick = () => {
    onClick?.(club)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${club.name}, ${club.type}, distance ${distLabel} hexes`}
      aria-pressed={selected}
      sx={{
        width: 108,
        borderRadius: 1.5,
        border: `2px solid ${selected ? colors.text : colors.border}`,
        bgcolor: colors.bg,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...(onClick && {
          '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: `0 4px 12px ${colors.border}88`,
          },
        }),
        ...(selected && {
          boxShadow: `0 0 10px ${colors.text}88`,
        }),
        '&:focus-visible': {
          outline: `3px solid ${colors.text}`,
          outlineOffset: 2,
        },
      }}
    >
      {/* Header row: club ID + type */}
      <Box
        sx={{
          px: 1,
          pt: 0.75,
          pb: 0.25,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: '1rem',
            color: colors.text,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {club.id}
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: '0.55rem',
            color: colors.text,
            opacity: 0.7,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {club.type}
        </Typography>
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 1, borderBottom: `1px solid ${colors.border}` }} />

      {/* Club name */}
      <Box sx={{ px: 1, pt: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            fontWeight: 600,
            fontSize: '0.6rem',
            color: colors.text,
            lineHeight: 1.3,
          }}
        >
          {club.name}
        </Typography>
      </Box>

      {/* Distance */}
      <Box
        sx={{
          px: 1,
          pt: 0.5,
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.5,
        }}
      >
        <Typography
          component="span"
          sx={{ fontWeight: 700, fontSize: '1rem', color: colors.text, lineHeight: 1 }}
        >
          {distLabel}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: '0.55rem', color: colors.text, opacity: 0.7 }}
        >
          hex
        </Typography>
      </Box>

      {/* Scatter (only shown when > 0) */}
      {club.scatter > 0 && (
        <Box sx={{ px: 1, pb: 0.25, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography
            component="span"
            sx={{ fontSize: '0.55rem', color: colors.text, opacity: 0.7 }}
          >
            scatter:
          </Typography>
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: '0.7rem', color: colors.text }}
          >
            {club.scatter}
          </Typography>
        </Box>
      )}

      {/* Ability (shown when present) */}
      {club.ability && (
        <>
          <Box sx={{ mx: 1, mt: 0.5, borderBottom: `1px solid ${colors.border}`, opacity: 0.5 }} />
          <Box sx={{ px: 1, pt: 0.5, pb: 0.75 }}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                fontSize: '0.55rem',
                color: colors.text,
                fontStyle: 'italic',
                lineHeight: 1.35,
                opacity: 0.9,
              }}
            >
              ★ {club.ability}
            </Typography>
          </Box>
        </>
      )}

      {/* Bottom padding when no ability */}
      {!club.ability && <Box sx={{ pb: 0.75 }} />}
    </Box>
  )
}
