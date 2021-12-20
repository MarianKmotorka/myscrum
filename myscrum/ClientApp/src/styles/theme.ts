import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles } from './components/ButtonStyles'

const theme = extendTheme({
  colors: {
    primary: '#fca311',
    secondary: '#14213d',
    bg: '#ffffff',
    bg2: '#edf0f3'
  },
  components: {
    Button: ButtonStyles
  }
})

export default theme
