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
  const [error, setError] = useState<string>()
  const { fetchUser } = useAuth()
  const navigate = useNavigate()
  const code = queryParams.get('code')
  const state = queryParams.get('state')

  useEffect(() => {
    const sendCodeToServer = async () => {
      const successOrError = await loginUsingGoogleCode(code!)
      if (successOrError !== true) return setError(successOrError)

      await fetchUser()
      navigate(getReturnUrlFromQuery(state) || '/')
    }

    code && sendCodeToServer()
  }, [fetchUser, navigate, code, state])

  return (
    <div>
      {error && <div>{error}</div>}

      {!error && <div>Authenticating...</div>}
    </div>
  )
}

export default GoogleLoginCallback
