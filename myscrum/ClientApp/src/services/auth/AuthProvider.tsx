import { CurrentUser } from 'domainTypes'
import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import * as authService from './authService'

export const IS_SIGNED_IN_LOCAL_STORAGE_KEY = 'myscrum.is_signed_in'

type AuthContextValue =
  | {
      isLoggedIn: false
      isLoading: boolean
      fetchUser: () => Promise<void>
    }
  | {
      isLoggedIn: true
      isLoading: boolean
      currentUser: CurrentUser
      logout: (shouldCallServer?: boolean) => Promise<void>
      fetchUser: () => Promise<void>
      updateUser: (newValues: Partial<CurrentUser>) => void
    }

const AuthContext = createContext<AuthContextValue>(null!)
export const useAuth = () => useContext(AuthContext)

export const useAuthorizedUser = () => {
  const auth = useAuth()

  if (!auth.isLoggedIn) throw new Error('This hook must be used only for authorized pages.')

  return {
    currentUser: auth.currentUser,
    isLoading: auth.isLoading,
    logout: auth.logout,
    updateUser: auth.updateUser
  }
}

const AuthProvider: FC = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<CurrentUser>()
  const queryClient = useQueryClient()
  useRefreshToken(!!user)

  const fetchUser = useCallback(async () => {
    setLoading(true)

    const user = await authService.fetchCurrentUser()
    if (user) {
      setUser(user)
      localStorage.setItem(IS_SIGNED_IN_LOCAL_STORAGE_KEY, 'true')
    } else {
      localStorage.removeItem(IS_SIGNED_IN_LOCAL_STORAGE_KEY)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    const initialLoad = async () => {
      if (localStorage.getItem(IS_SIGNED_IN_LOCAL_STORAGE_KEY)) await fetchUser()
      setLoading(false)
    }

    initialLoad()
  }, [fetchUser])

  useEffect(() => {
    //NOTE: Clear cache so cached queries are reloaded once logged in (e.g.: notifications, friend-requests)
    const isLoggedIn = !!user
    if (!isLoggedIn) queryClient.clear()
  }, [user, queryClient])

  const logout = useCallback(async (shouldCallServer?: boolean) => {
    if (shouldCallServer !== false) await authService.logout()
    localStorage.removeItem(IS_SIGNED_IN_LOCAL_STORAGE_KEY)
    setUser(undefined)
  }, [])

  const updateUser = useCallback(
    (newValues: Partial<CurrentUser>) => {
      if (user) setUser({ ...user, ...newValues })
    },
    [user]
  )

  const value: AuthContextValue = user
    ? {
        currentUser: user,
        isLoggedIn: true,
        isLoading: loading,
        updateUser,
        fetchUser,
        logout
      }
    : {
        isLoggedIn: false,
        isLoading: loading,
        fetchUser
      }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useRefreshToken = (isLoggedIn: boolean) => {
  useEffect(() => {
    if (!isLoggedIn) return

    const intervalId = setInterval(() => authService.refreshToken(), 1_770_000) // 29.5 minutes
    return () => clearInterval(intervalId)
  }, [isLoggedIn])
}

export default AuthProvider
