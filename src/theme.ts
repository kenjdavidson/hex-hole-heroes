import { createTheme } from '@mui/material/styles'
import { green } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: green[700],
      light: green[400],
      dark: green[900],
    },
    secondary: {
      main: green[200],
      dark: green[400],
    },
    background: {
      default: green[50],
    },
  },
})

export default theme
