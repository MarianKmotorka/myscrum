import { useAuth } from 'services/auth/AuthProvider'

const Home = () => {
  const auth = useAuth()

  return auth.isLoggedIn ? (
    <pre>{JSON.stringify(auth.currentUser, null, 2)}</pre>
  ) : auth.isLoading ? (
    <div>...LOADING</div>
  ) : (
    <div>LOGGED OUT</div>
  )
}

export default Home
