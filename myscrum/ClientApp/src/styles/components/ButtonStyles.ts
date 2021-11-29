import { whiten } from '@chakra-ui/theme-tools'

export const ButtonStyles = {
  // style object for base or default style
  baseStyle: {},

  // styles for different sizes ("sm", "md", "lg")
  sizes: {},

  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: 'primary.700',
      color: 'white',
      _hover: {
        bg: 'primary.800'
      }
    },
    primaryOutline: {
      bg: 'transparent',
      color: 'primary.700',
      border: '1px solid',
      borderColor: 'primary.700',
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
        bg: whiten('secondary', 90)
      }
    }
  },

  // default values for `size` and `variant`
  defaultProps: {}
}
