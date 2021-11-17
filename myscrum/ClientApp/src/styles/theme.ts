import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles } from './components/ButtonStyles'

const theme = extendTheme({
  colors: {
    primary: '#113F67',
    secondary: '#F0B917'
  },
  components: {
    Button: ButtonStyles
  }
})

export default theme
