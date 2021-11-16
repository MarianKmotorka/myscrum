import { Button } from '@chakra-ui/button'

const getGoogleLoginUrl = (redirectedFrom?: string) => {
  const redirectUri = `${window.location.origin + process.env.REACT_APP_GOOGLE_AUTH_CALLBACK_URL}`

  const queryParams = [
    `client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}`,
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

const Login = () => {
  const redirect = () => window.location.assign(getGoogleLoginUrl())

  return <Button onClick={redirect}>Login with google</Button>
}

export default Login
