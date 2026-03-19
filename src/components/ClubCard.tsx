import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Club, ClubType } from '../types/club'

export const TYPE_COLORS: Record<ClubType, { bg: string; text: string; border: string }> = {
  Wood: { bg: '#4E342E', text: '#FFCC80', border: '#8D6E63' },
  Iron: { bg: '#37474F', text: '#B0BEC5', border: '#607D8B' },
  Wedge: { bg: '#E65100', text: '#FFF9C4', border: '#F57F17' },
  Putter: { bg: '#1A237E', text: '#C5CAE9', border: '#3949AB' },
}

/** Card dimensions — 80% of the 160px reference width, standard 1:1.4 card aspect ratio */
export const CARD_WIDTH = 128
export const CARD_HEIGHT = 180

interface ClubCardProps {
  club: Club
  selected?: boolean
  onClick?: (club: Club) => void
}

export default function ClubCard({ club, selected = false, onClick }: ClubCardProps) {
  const colors = TYPE_COLORS[club.type]
  const [distMin, distMax] = club.dist
  const distLabel = distMin === distMax ? `${distMin}` : `${distMin}–${distMax}`

  const handleClick = () => onClick?.(club)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <Box
      role={onClick ? 'button' : undefined}
      tabIndex={0}
      aria-label={`${club.name}, ${club.type}, distance ${distLabel} hexes`}
      aria-pressed={onClick ? selected : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        bgcolor: colors.bg,
        border: `2px solid ${selected ? colors.text : colors.border}`,
        borderRadius: 1.5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transform: selected ? 'translateY(-10px)' : undefined,
        boxShadow: selected ? `0 0 8px ${colors.text}88` : undefined,
        '&:hover, &:focus-visible': {
          transform: 'translateY(-10px)',
          outline: 'none',
        },
      }}
    >
      {/* Header: ID + type badge */}
      <Box
        sx={{
          px: 1.25,
          pt: 0.75,
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
            fontSize: '0.88rem',
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {club.id}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: '0.48rem', color: colors.text, opacity: 0.7, textTransform: 'uppercase' }}
        >
          {club.type}
        </Typography>
      </Box>

      <Box sx={{ mx: 1.25, borderBottom: `1px solid ${colors.border}` }} />

      <Box sx={{ px: 1.25, pt: 0.75 }}>
        <Typography
          component="span"
          sx={{ display: 'block', fontWeight: 600, fontSize: '0.6rem', color: colors.text, mb: 0.5 }}
        >
          {club.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: '0.96rem', color: colors.text, lineHeight: 1 }}
          >
            {distLabel}
          </Typography>
          <Typography component="span" sx={{ fontSize: '0.52rem', color: colors.text, opacity: 0.7 }}>
            hex
          </Typography>
        </Box>

        {club.scatter > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <Typography component="span" sx={{ fontSize: '0.52rem', color: colors.text, opacity: 0.7 }}>
              scatter:
            </Typography>
            <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.6rem', color: colors.text }}>
              {club.scatter}
            </Typography>
          </Box>
        )}
      </Box>

      {club.ability && (
        <>
          <Box sx={{ mx: 1.25, mt: 0.75, borderBottom: `1px solid ${colors.border}`, opacity: 0.5 }} />
          <Box sx={{ px: 1.25, pt: 0.5, pb: 1 }}>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.52rem',
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
    </Box>
  )
}
