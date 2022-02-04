import { User } from 'domainTypes'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import { useQuery } from 'react-query'
import FetchError from 'components/elements/FetchError'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'
import UserItem from 'components/elements/UserItem'
import { toLocalTime } from 'utils'

interface ResponseDto extends User {
  lastLogin: string
}

const AdminPage = () => {
  const { data, isLoading, error } = useQuery<ResponseDto[], ApiError>(
    ['users'],
    async () => (await api.get('/users')).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return (
    <VStack alignItems='flex-start' spacing={5} mt={4}>
      {data.map(x => (
        <Box key={x.id}>
          <UserItem user={x} />
          <Text color='gray.400'>{toLocalTime(x.lastLogin)}</Text>
        </Box>
      ))}
    </VStack>
  )
}

export default AdminPage
