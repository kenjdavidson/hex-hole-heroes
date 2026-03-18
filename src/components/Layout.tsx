import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import MenuIcon from '@mui/icons-material/Menu'
import HexagonIcon from '@mui/icons-material/Hexagon'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectSelectedGolfer } from '../store/playerSlice'
import NewGameModal from './NewGameModal'

import { green } from '@mui/material/colors'

const hexPatternSvg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="104" height="90"><g fill="none" stroke="${green[300]}" stroke-width="1.5"><polygon points="26,0 52,15 52,45 26,60 0,45 0,15"/><polygon points="78,0 104,15 104,45 78,60 52,45 52,15"/><line x1="26" y1="60" x2="26" y2="90"/><line x1="78" y1="60" x2="78" y2="90"/></g></svg>`,
)

export default function Layout() {
  const selectedGolfer = useSelector(selectSelectedGolfer)

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [newGameOpen, setNewGameOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleNewGameOpen = () => {
    handleMenuClose()
    setNewGameOpen(true)
  }

  const handleNewGameClose = () => {
    setNewGameOpen(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          {/* Left: Hex icon of currently selected player */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
            aria-label="selected player icon"
          >
            <HexagonIcon
              sx={{
                fontSize: 40,
                color: selectedGolfer
                  ? selectedGolfer.ui.primaryColor
                  : 'primary.light',
              }}
            />
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.6rem',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {selectedGolfer ? selectedGolfer.initials : '?'}
            </Typography>
          </Box>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hex Hole Heroes
          </Typography>

          {/* Right: Hamburger menu */}
          <IconButton
            color="inherit"
            aria-label="open menu"
            aria-controls="app-menu"
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="app-menu"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleNewGameOpen}>New Game</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* New Game modal */}
      <NewGameModal open={newGameOpen} onClose={handleNewGameClose} />

      {/* Main content: two panels */}
      <Box
        component="main"
        sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}
      >
        {/* Left panel: Board */}
        <Paper
          elevation={0}
          square
          sx={{
            flex: 2,
            overflow: 'auto',
            backgroundImage: `url("data:image/svg+xml,${hexPatternSvg}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '104px 90px',
            bgcolor: 'background.default',
            borderRight: 1,
            borderColor: 'divider',
          }}
          aria-label="board panel"
        >
          <Outlet />
        </Paper>

        {/* Right panel: Scorecard */}
        <Paper
          elevation={0}
          square
          sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.paper' }}
          aria-label="scorecard panel"
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scorecard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Scores will appear here.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Status bar */}
      <Box
        component="footer"
        sx={{
          px: 2,
          py: 0.5,
          bgcolor: 'primary.dark',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          minHeight: 32,
        }}
        aria-label="status bar"
      >
        <Typography variant="caption">
          {selectedGolfer
            ? `Active golfer: ${selectedGolfer.name}`
            : 'No golfer selected'}
        </Typography>
      </Box>
    </Box>
  )
}
