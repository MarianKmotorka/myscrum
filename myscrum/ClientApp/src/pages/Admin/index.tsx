import { User } from 'domainTypes'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import { useQuery } from 'react-query'
import FetchError from 'components/elements/FetchError'
import { Box, Grid, IconButton, Spinner, Text } from '@chakra-ui/react'
import UserItem from 'components/elements/UserItem'
import { toLocalTime } from 'utils'
import { FiRefreshCcw } from 'react-icons/fi'

interface ResponseDto extends User {
  lastLogin: string
  email: string
}

const AdminPage = () => {
  const { data, isLoading, error, refetch, isFetching } = useQuery<ResponseDto[], ApiError>(
    ['users'],
    async () => (await api.get('/users')).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return (
    <>
      <IconButton aria-label='Refresh' isLoading={isFetching} onClick={() => refetch()} mt={3}>
        <FiRefreshCcw />
      </IconButton>

      <Grid gap={3} mt={4} templateColumns='repeat(auto-fit,230px)'>
        {data.map(x => (
          <Box key={x.id} border='solid 1px' borderColor='gray.200' borderRadius='lg' p={3}>
            <UserItem user={x} />
            <Text color='gray.400'>{x.email}</Text>
            <Text color='gray.400'>{toLocalTime(x.lastLogin)}</Text>
          </Box>
        ))}
      </Grid>
    </>
  )
}

export default AdminPage
