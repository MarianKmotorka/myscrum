import { Box, ChakraProps } from '@chakra-ui/react'

interface ProgressbarProps extends ChakraProps {
  value: number
  max: number
}

const Progressbar = ({ value, max, ...rest }: ProgressbarProps) => {
  const valueFlex = value / max
  const maxValueFlex = 1 - valueFlex
  const overflownValueFlex = max === 0 && value !== 0 ? 1 : valueFlex - 1

  return (
    <Box height='25px' width='100%' display='flex' borderRadius='0px' overflow='hidden' {...rest}>
      <Box flex={valueFlex} bg='#107C10'></Box>

      <Box flex={maxValueFlex} bg='gray.100' borderRight='solid 4px' borderColor='gray.700'></Box>

      <Box flex={overflownValueFlex} bg='red.500'></Box>
    </Box>
  )
}

export default Progressbar
