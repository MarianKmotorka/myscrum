import DefaultLayout from 'components/layouts/DefaultLayout'
import ProtectedRoute from 'components/layouts/ProtectedRoute'
import Backlog from 'pages/Backlog/Backlog'
import Invitations from 'pages/Invitations/Invitations'
import SprintDetail from 'pages/Sprints/SprintDetail/SprintDetail'
import Sprints from 'pages/Sprints/Sprints'
import WorkItemDetailPage from 'pages/WorkItemDetail/WorkItemDetail'
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
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/invitations'
        element={
          <ProtectedRoute>
            <DefaultLayout>
              <Invitations />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/sprints'
        element={
          <ProtectedRoute needsSelectedProject>
            <DefaultLayout>
              <Sprints />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/sprints/:id'
        element={
          <ProtectedRoute needsSelectedProject>
            <DefaultLayout>
              <SprintDetail />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/backlog'
        element={
          <ProtectedRoute needsSelectedProject>
            <DefaultLayout>
              <Backlog />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path='/work-items/:id'
        element={
          <ProtectedRoute needsSelectedProject>
            <DefaultLayout>
              <WorkItemDetailPage />
            </DefaultLayout>
          </ProtectedRoute>
        }
      />

      <Route path='/login' element={<Login />} />

      <Route path='google-login-callback' element={<GoogleLoginCallback />} />
    </RouterRoutes>
  )
}

export default Routes
