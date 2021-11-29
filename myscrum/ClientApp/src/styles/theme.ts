import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles } from './components/ButtonStyles'

const theme = extendTheme({
  colors: {
    primary: '#500472',
    secondary: '#79cbb8'
  },
  components: {
    Button: ButtonStyles
  }
})

export default theme
