import api, { setAuthHeader } from 'api/httpClient'
import { ApiError } from 'api/types'
import { AxiosInstance } from 'axios'
import { User } from 'domainTypes'

export const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    //pass
  }
  setAuthHeader(undefined)
}

export const fetchCurrentUser = async () => {
  const hasAuthHeader = !!api.defaults.headers.common['Authorization']

  try {
    if (!hasAuthHeader) {
      await refreshToken()
    }
    const res = await api.get('/auth/me')
    return res.data as User
  } catch (err) {
    return undefined
  }
}

export const getGoogleLoginUrl = (redirectedFrom?: string) => {
  const redirectUri = `${window.location.origin + process.env.NEXT_PUBLIC_GOOGLE_AUTH_CALLBACK_URL}`

  const queryParams = [
    `client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    `redirect_uri=${redirectUri}`,
    'response_type=code',
    'scope=openid profile email',
    'access_type=offline',
    redirectedFrom && `state=${encodeURI(JSON.stringify({ returnUrl: redirectedFrom }))}`
  ]
    .filter(x => !!x)
    .join('&')

  return 'https://accounts.google.com/o/oauth2/v2/auth?' + queryParams
}

/**
 * @returns true or error message
 */
export const loginUsingGoogleCode = async (code: string) => {
  try {
    const res = await api.post('/auth/google-login', { code })
    setAuthHeader(res.data.accessToken)
    return true
  } catch (err) {
    return err as ApiError
  }
}

/**
 * @returns accessToken
 */
export const refreshToken = async (client: AxiosInstance = api): Promise<string> => {
  try {
    const response = await client.get('/auth/refresh-token')
    const { accessToken } = response.data
    setAuthHeader(accessToken)
    return Promise.resolve(accessToken)
  } catch (_) {
    return Promise.reject('FAILED TO REFRESH TOKEN')
  }
}
