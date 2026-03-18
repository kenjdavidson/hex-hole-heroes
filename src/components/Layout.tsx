import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import MenuIcon from '@mui/icons-material/Menu'
import HexagonIcon from '@mui/icons-material/Hexagon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectSelectedPlayer,
  selectAvailableGolfers,
  setSelectedPlayer,
} from '../store/playerSlice'
import type { Golfer } from '../store/playerSlice'

export default function Layout() {
  const dispatch = useDispatch()
  const selectedPlayer = useSelector(selectSelectedPlayer)
  const availableGolfers = useSelector(selectAvailableGolfers)

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [golferMenuOpen, setGolferMenuOpen] = useState(false)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
    setGolferMenuOpen(false)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setGolferMenuOpen(false)
  }

  const handleSelectGolferToggle = () => {
    setGolferMenuOpen((prev) => !prev)
  }

  const handleGolferSelect = (golfer: Golfer) => {
    dispatch(setSelectedPlayer(golfer))
    handleMenuClose()
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
            <HexagonIcon sx={{ fontSize: 40, color: 'primary.light' }} />
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
              {selectedPlayer ? selectedPlayer.initials : '?'}
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
            <MenuItem onClick={handleSelectGolferToggle}>
              <Typography sx={{ flexGrow: 1 }}>Select Golfer</Typography>
              {golferMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </MenuItem>
            {golferMenuOpen && <Divider />}
            {golferMenuOpen &&
              availableGolfers.map((golfer) => (
                <MenuItem
                  key={golfer.id}
                  onClick={() => handleGolferSelect(golfer)}
                  selected={selectedPlayer?.id === golfer.id}
                  sx={{ pl: 4 }}
                >
                  {golfer.name}
                </MenuItem>
              ))}
          </Menu>
        </Toolbar>
      </AppBar>

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
          {selectedPlayer
            ? `Active golfer: ${selectedPlayer.name}`
            : 'No golfer selected'}
        </Typography>
      </Box>
    </Box>
  )
}
