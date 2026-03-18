import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectAvailableGolfers,
  selectSelectedPlayer,
  setSelectedPlayer,
} from '../store/playerSlice'
import type { Golfer } from '../store/playerSlice'
import PlayerCard from './PlayerCard'

interface NewGameModalProps {
  open: boolean
  onClose: () => void
}

export default function NewGameModal({ open, onClose }: NewGameModalProps) {
  const dispatch = useDispatch()
  const availableGolfers = useSelector(selectAvailableGolfers)
  const selectedPlayer = useSelector(selectSelectedPlayer)

  const handleSelectGolfer = (golfer: Golfer) => {
    dispatch(setSelectedPlayer(golfer))
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      aria-labelledby="new-game-dialog-title"
    >
      <DialogTitle id="new-game-dialog-title" sx={{ pr: 6 }}>
        New Game — Choose Your Golfer
        <IconButton
          aria-label="close new game dialog"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Click a card to select your golfer and start a new game.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            py: 1,
          }}
        >
          {availableGolfers.map((golfer) => (
            <PlayerCard
              key={golfer.id}
              golfer={golfer}
              selected={selectedPlayer?.id === golfer.id}
              onClick={handleSelectGolfer}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
