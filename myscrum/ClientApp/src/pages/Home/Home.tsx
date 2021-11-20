import DefaultLayout from 'components/layouts/DefaultLayout'
import { useAuth } from 'services/auth/AuthProvider'

const Home = () => {
  const auth = useAuth()

  return (
    <DefaultLayout>
      <div>Home</div>
    </DefaultLayout>
  )
}

export default Home
