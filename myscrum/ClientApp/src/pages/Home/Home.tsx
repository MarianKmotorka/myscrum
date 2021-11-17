import { useAuth } from 'services/auth/AuthProvider'

const Home = () => {
  const auth = useAuth()

  return auth.isLoggedIn ? (
    <div>{JSON.stringify(auth.currentUser, null, 2)}</div>
  ) : auth.isLoading ? (
    <div>...LOADING</div>
  ) : (
    <div>LOGGED OUT</div>
  )
}

export default Home
