import { Box } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useAuth } from 'services/auth/AuthProvider'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = useAuth()

  if (auth.isLoading && !auth.isLoggedIn)
    return (
      <Box h='100vh' d='grid' placeItems='center'>
        <Spinner thickness='4px' speed='0.65s' color='gray.500' size='xl' />
      </Box>
    )

  if (!auth.isLoggedIn) {
    const { href, origin } = window.location
    const path = href.replace(origin, '')

    window.location.replace(`/login?redirectedFrom=${path}`)
    return <></>
  }

  return children
}

export default ProtectedRoute
