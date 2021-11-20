import DefaultLayout from 'components/layouts/DefaultLayout'
import { useAuth } from 'services/auth/AuthProvider'

const Home = () => {
  const auth = useAuth()

  return (
    <DefaultLayout>
      <div style={{ height: 1500 }}>Home</div>
    </DefaultLayout>
  )
}

export default Home
