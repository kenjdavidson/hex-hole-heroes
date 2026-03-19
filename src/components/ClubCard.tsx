import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Club } from '../types/club'
import type { Golfer } from '../types/player'

/** Fallback colors used when no golfer is selected */
const DEFAULT_PRIMARY = '#37474F'
const DEFAULT_ACCENT = '#B0BEC5'

/** Card dimensions — 80% of the 160px reference width, standard 1:1.4 card aspect ratio */
export const CARD_WIDTH = 128
export const CARD_HEIGHT = 180

/** Fraction of card height reserved for the top image screen area */
const SCREEN_HEIGHT_RATIO = 0.4
/** Height of the image screen area at the top of the card */
export const SCREEN_HEIGHT = Math.round(CARD_HEIGHT * SCREEN_HEIGHT_RATIO)

/** Hex alpha suffix for the unselected border (40% opacity) */
const BORDER_ALPHA = '66'

interface ClubCardProps {
  club: Club
  golfer?: Golfer | null
  selected?: boolean
  onClick?: (club: Club) => void
}

export default function ClubCard({ club, golfer, selected = false, onClick }: ClubCardProps) {
  const primaryColor = golfer?.ui.primaryColor ?? DEFAULT_PRIMARY
  const accentColor = golfer?.ui.accentColor ?? DEFAULT_ACCENT

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
        bgcolor: primaryColor,
        border: `2px solid ${selected ? accentColor : `${accentColor}${BORDER_ALPHA}`}`,
        borderRadius: 1.5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transform: selected ? 'translateY(-10px)' : undefined,
        boxShadow: selected ? `0 0 8px ${accentColor}88` : undefined,
        '&:hover, &:focus-visible': {
          transform: 'translateY(-10px)',
          outline: 'none',
        },
      }}
    >
      {/* Screen section: top portion reserved for card image */}
      <Box
        aria-hidden="true"
        data-testid="card-screen"
        sx={{
          height: SCREEN_HEIGHT,
          bgcolor: 'rgba(0,0,0,0.25)',
          flexShrink: 0,
          borderBottom: `1px solid ${accentColor}33`,
        }}
      />

      {/* Header: ID + type badge */}
      <Box
        sx={{
          px: 1.25,
          pt: 0.5,
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
            fontSize: '0.88rem',
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {club.id}
        </Typography>
        <Typography
          component="span"
          sx={{ fontSize: '0.48rem', color: accentColor, opacity: 0.7, textTransform: 'uppercase' }}
        >
          {club.type}
        </Typography>
      </Box>

      <Box sx={{ mx: 1.25, borderBottom: `1px solid ${accentColor}40` }} />

      <Box sx={{ px: 1.25, pt: 0.5 }}>
        <Typography
          component="span"
          sx={{ display: 'block', fontWeight: 600, fontSize: '0.6rem', color: accentColor, mb: 0.25 }}
        >
          {club.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
          <Typography
            component="span"
            sx={{ fontWeight: 700, fontSize: '0.96rem', color: accentColor, lineHeight: 1 }}
          >
            {distLabel}
          </Typography>
          <Typography component="span" sx={{ fontSize: '0.52rem', color: accentColor, opacity: 0.7 }}>
            hex
          </Typography>
        </Box>

        {club.scatter > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
            <Typography component="span" sx={{ fontSize: '0.52rem', color: accentColor, opacity: 0.7 }}>
              scatter:
            </Typography>
            <Typography component="span" sx={{ fontWeight: 700, fontSize: '0.6rem', color: accentColor }}>
              {club.scatter}
            </Typography>
          </Box>
        )}
      </Box>

      {club.ability && (
        <>
          <Box sx={{ mx: 1.25, mt: 0.5, borderBottom: `1px solid ${accentColor}40`, opacity: 0.5 }} />
          <Box sx={{ px: 1.25, pt: 0.25, pb: 0.75 }}>
            <Typography
              component="span"
              sx={{
                display: 'block',
                fontSize: '0.52rem',
                color: accentColor,
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
