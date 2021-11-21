import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'

import App from './App'
import theme from 'styles/theme'
import * as serviceWorker from './serviceWorker'
import { GlobalStyles } from 'styles/GlobalStyles'
import AuthProvider from 'services/auth/AuthProvider'
import ProjectsProvider from 'services/ProjectsProvider'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
})

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProjectsProvider>
            <ChakraProvider theme={theme}>
              <GlobalStyles />

              <App />
            </ChakraProvider>
          </ProjectsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
