import * as React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import App from './App'
import * as serviceWorker from './serviceWorker'
import AuthProvider from 'services/auth/AuthProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { GlobalStyles } from 'styles/GlobalStyles'
import theme from 'styles/theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
})

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ChakraProvider theme={theme}>
            <GlobalStyles />

            <App />
          </ChakraProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
