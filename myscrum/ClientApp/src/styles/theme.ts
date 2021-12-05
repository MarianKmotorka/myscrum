import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles } from './components/ButtonStyles'

const theme = extendTheme({
  colors: {
    primary: '#678983',
    secondary: '#181D31',
    bg: '#F0E9D2',
    bg2: '#E6DDC4'
  },
  components: {
    Button: ButtonStyles
  }
})

export default theme
