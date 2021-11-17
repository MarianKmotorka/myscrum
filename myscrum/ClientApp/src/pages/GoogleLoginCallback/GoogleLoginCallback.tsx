import { Box } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { ApiError } from 'api/types'
import FetchError from 'components/elements/FetchError'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from 'services/auth/AuthProvider'
import { loginUsingGoogleCode } from 'services/auth/authService'

const getReturnUrlFromQuery = (state: string | null) => {
  try {
    const returnUrl = JSON.parse(state || '').returnUrl
    if (returnUrl) return returnUrl as string
  } catch (err) {
    return undefined
  }
}

const GoogleLoginCallback = () => {
  const [queryParams] = useSearchParams()
  const [error, setError] = useState<ApiError>()
  const { fetchUser } = useAuth()
  const navigate = useNavigate()
  const code = queryParams.get('code')
  const state = queryParams.get('state')

  useEffect(() => {
    const sendCodeToServer = async () => {
      const successOrError = await loginUsingGoogleCode(code!)
      if (successOrError !== true) return setError(successOrError)

      await fetchUser()
      navigate(getReturnUrlFromQuery(state) || '/', { replace: true })
    }

    code && sendCodeToServer()
  }, [fetchUser, navigate, code, state])

  return (
    <div>
      {error && <FetchError error={error} />}

      {!error && (
        <Box h='100vh' d='grid' placeItems='center'>
          <Spinner thickness='4px' speed='0.65s' color='gray.500' size='xl' />
        </Box>
      )}
    </div>
  )
}

export default GoogleLoginCallback
