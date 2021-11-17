import ProtectedRoute from 'components/layouts/ProtectedRoute'
import { Route, Routes as RouterRoutes } from 'react-router'
import GoogleLoginCallback from './pages/GoogleLoginCallback/GoogleLoginCallback'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'

const Routes = () => {
  return (
    <RouterRoutes>
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path='/login' element={<Login />} />

      <Route path='google-login-callback' element={<GoogleLoginCallback />} />
    </RouterRoutes>
  )
}

export default Routes
