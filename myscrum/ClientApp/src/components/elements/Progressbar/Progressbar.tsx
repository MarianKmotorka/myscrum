import { Box, ChakraProps } from '@chakra-ui/react'

interface ProgressbarProps extends ChakraProps {
  value: number
  max: number
}

const Progressbar = ({ value, max, ...rest }: ProgressbarProps) => {
  const assignedWorkFlex = value / max
  const capacityFlex = 1 - assignedWorkFlex
  const overflowWorkFlex = assignedWorkFlex - 1

  return (
    <Box height='25px' width='100%' display='flex' borderRadius='0px' overflow='hidden' {...rest}>
      <Box flex={assignedWorkFlex} bg='#107C10'></Box>

      <Box flex={capacityFlex} bg='gray.100' borderRight='solid 4px' borderColor='gray.700'></Box>

      <Box flex={overflowWorkFlex} bg='red.500'></Box>
    </Box>
  )
}

export default Progressbar
