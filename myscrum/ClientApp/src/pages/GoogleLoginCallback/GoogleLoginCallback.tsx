import { ParsedUrlQuery } from 'querystring'
import { useSearchParams } from 'react-router-dom'

const getReturnUrlFromQuery = (query: ParsedUrlQuery) => {
  try {
    const returnUrl = JSON.parse(query.state as string).returnUrl
    if (returnUrl) return returnUrl as string
  } catch (err) {
    return undefined
  }
}

const GoogleLoginCallback = () => {
  const [queryParams] = useSearchParams()
  const code = queryParams.get('code')

  //   useEffect(() => {
  //     const sendCodeToServer = async () => {
  //       const successOrError = await loginUsingGoogleCode(query.code as string)
  //       if (successOrError !== true) return setError(successOrError)

  //       await fetchUser()
  //       replace(getReturnUrlFromQuery(query) || '/home')
  //     }

  //     query.code && sendCodeToServer()
  //   }, [query, fetchUser, replace])

  return <div>{code}</div>
}

export default GoogleLoginCallback
