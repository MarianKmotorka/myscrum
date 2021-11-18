import { Box, Container } from '@chakra-ui/layout'
import Navbar from 'components/modules/Navbar/Navbar'

interface DefaultLayoutProps {
  children: JSX.Element
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <Box>
      {/* <Box h='70px' borderBottom='1px solid' borderBottomColor='gray.200'>
        <Container maxW='5xl'>NAVBAR</Container>
      </Box> */}

      <Navbar />

      <Container maxW='5xl'>{children}</Container>
    </Box>
  )
}

export default DefaultLayout
