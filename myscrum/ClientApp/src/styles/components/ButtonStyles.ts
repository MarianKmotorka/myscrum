import { whiten, darken } from '@chakra-ui/theme-tools'

export const ButtonStyles = {
  // style object for base or default style
  baseStyle: {},

  // styles for different sizes ("sm", "md", "lg")
  sizes: {},

  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: 'primary',
      color: 'white',
      _hover: {
        bg: darken('primary', 5)
      }
    },
    primaryOutline: {
      bg: 'transparent',
      color: 'primary',
      border: '1px solid',
      borderColor: 'primary',
      transition: 'all 200ms ease',
      _hover: {
        bg: 'gray.100'
      }
    },

    secondary: {
      bg: 'secondary',
      color: 'white',
      _hover: {
        bg: whiten('secondary', 20)
      }
    },
    secondaryOutline: {
      bg: 'transparent',
      color: 'secondary',
      border: '1px solid',
      borderColor: 'secondary',
      transition: 'all 200ms ease',
      _hover: {
        bg: 'bg2'
      }
    },
    ghost: {
      _hover: {
        bg: 'gray.50'
      }
    },
    bgGhost: {
      bg: 'bg2',
      _hover: {
        bg: 'transparent'
      }
    }
  },

  // default values for `size` and `variant`
  defaultProps: {}
}
