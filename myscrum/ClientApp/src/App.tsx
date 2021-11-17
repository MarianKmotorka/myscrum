import { Button, HStack } from '@chakra-ui/react'
import Routes from './Routes'
const App = () => {
  return (
    <>
      <Routes />
      <HStack spacing='10px'>
        <Button variant='primary'>SIssawdawdZ</Button>
        <Button variant='secondary'>SIssZ</Button>
        <Button variant='secondaryOutline'>SIssZ</Button>
        <Button variant='primaryOutline'>SIssZ</Button>
        <Button variant='ghost'>SIssZ</Button>
      </HStack>
    </>
  )
}

export default App
