import { Box, Container } from '@chakra-ui/layout'
import { SlideFade } from '@chakra-ui/react'
import Navbar from 'components/modules/Navbar/Navbar'
import { useLocation } from 'react-router'

interface DefaultLayoutProps {
  children: JSX.Element
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { pathname } = useLocation()
  return (
    <Box>
      <Navbar />

      <Container maxW='6xl'>
        <SlideFade key={pathname} in offsetY={0} offsetX={-10}>
          {children}
        </SlideFade>
      </Container>
    </Box>
  )
}

export default DefaultLayout
