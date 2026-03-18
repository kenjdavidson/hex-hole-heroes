import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Golfer } from '../types/player'

interface PlayerCardProps {
  golfer: Golfer
  selected?: boolean
  onClick?: (golfer: Golfer) => void
}

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
// For a flat-top regular hexagon using polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%),
// all 6 sides are equal when H = W × (√3 / 2).
const CARD_WIDTH = 200
const CARD_HEIGHT = Math.round(CARD_WIDTH * (Math.sqrt(3) / 2)) // ≈ 173
const BORDER_WIDTH = 7

export default function PlayerCard({
  golfer,
  selected = false,
  onClick,
}: PlayerCardProps) {
  const handleClick = () => {
    console.log(golfer.id)
    onClick?.(golfer)
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
      aria-label={`Select ${golfer.name}`}
      aria-pressed={selected}
      sx={{
        position: 'relative',
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'transform 0.15s ease',
        '&:hover': { transform: 'scale(1.06)' },
        '&:focus-visible': {
          outline: `3px solid ${golfer.ui.primaryColor}`,
          outlineOffset: 4,
          borderRadius: 1,
        },
      }}
    >
      {/* Outer hex – acts as border */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: golfer.ui.primaryColor,
          clipPath: HEX_CLIP,
          filter: selected
            ? `drop-shadow(0 0 8px ${golfer.ui.primaryColor})`
            : 'none',
        }}
        aria-hidden
      />

      {/* Inner hex – content area */}
      <Box
        sx={{
          position: 'absolute',
          top: BORDER_WIDTH,
          left: BORDER_WIDTH,
          right: BORDER_WIDTH,
          bottom: BORDER_WIDTH,
          bgcolor: golfer.ui.accentColor,
          clipPath: HEX_CLIP,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Name along the top */}
        <Typography
          variant="caption"
          component="span"
          sx={{
            position: 'absolute',
            top: '14%',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.62rem',
            lineHeight: 1.2,
            color: golfer.ui.primaryColor,
            px: 3,
          }}
        >
          {golfer.name}
        </Typography>

        {/* Large abbreviation in center */}
        <Typography
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: '2.4rem',
            lineHeight: 1,
            color: golfer.ui.primaryColor,
            letterSpacing: 2,
          }}
        >
          {golfer.initials}
        </Typography>

        {/* Archetype at bottom */}
        <Typography
          variant="caption"
          component="span"
          sx={{
            position: 'absolute',
            bottom: '14%',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '0.6rem',
            color: golfer.ui.primaryColor,
            opacity: 0.85,
            px: 3,
          }}
        >
          {golfer.archetype}
        </Typography>
      </Box>
    </Box>
  )
}
