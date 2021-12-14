import { Toaster } from 'react-hot-toast'
import { toastOptions } from 'services/toastService'
import Routes from './Routes'

const App = () => {
  return (
    <>
      <Routes />
      <Toaster toastOptions={toastOptions} />
    </>
  )
}

export default App
