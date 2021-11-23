import { Box } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useAuth } from 'services/auth/AuthProvider'
import { useProjects } from 'services/ProjectsProvider'

interface ProtectedRouteProps {
  children: JSX.Element
  needsSelectedProject?: boolean
}

const ProtectedRoute = ({ children, needsSelectedProject }: ProtectedRouteProps) => {
  const auth = useAuth()
  const { selectedProject } = useProjects()

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

  if (needsSelectedProject && !selectedProject) {
    window.location.replace(`/`)
    return <></>
  }

  return children
}

export default ProtectedRoute
