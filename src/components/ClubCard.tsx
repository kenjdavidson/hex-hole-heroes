import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { Club, ClubType } from '../types/club'

export const TYPE_COLORS: Record<ClubType, { bg: string; text: string; border: string }> = {
  Wood: { bg: '#4E342E', text: '#FFCC80', border: '#8D6E63' },
  Iron: { bg: '#37474F', text: '#B0BEC5', border: '#607D8B' },
  Wedge: { bg: '#E65100', text: '#FFF9C4', border: '#F57F17' },
  Putter: { bg: '#1A237E', text: '#C5CAE9', border: '#3949AB' },
}

export const CARD_WIDTH = 44
export const CARD_HEIGHT = 88

/** Full card details rendered inside the hover Tooltip */
function ClubDetail({ club }: { club: Club }) {
  const colors = TYPE_COLORS[club.type]
  const [distMin, distMax] = club.dist
  const distLabel = distMin === distMax ? `${distMin}` : `${distMin}–${distMax}`

  return (
    <Box
      sx={{
        width: 160,
        borderRadius: 1.5,
        border: `2px solid ${colors.border}`,
        bgcolor: colors.bg,
        overflow: 'hidden',
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
    <Tooltip
      title={<ClubDetail club={club} />}
      placement="top"
      enterDelay={150}
      enterNextDelay={150}
      slotProps={{
        tooltip: { sx: { p: 0, bgcolor: 'transparent', boxShadow: 'none', maxWidth: 'none' } },
      }}
    >
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
          borderRadius: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          pt: 1,
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
        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: '0.8rem',
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          {club.id}
        </Typography>
      </Box>
    </Tooltip>
  )
}
