import { ApiError } from 'api/types'
import { User } from 'domainTypes'
import { useQuery } from 'react-query'
import api from 'api/httpClient'
import { Spinner } from '@chakra-ui/spinner'
import FetchError from 'components/elements/FetchError'
import { AspectRatio, Badge, Box, Grid, HStack, Text, VStack } from '@chakra-ui/layout'
import { Button, ButtonGroup } from '@chakra-ui/button'
import UserItem from 'components/elements/UserItem'

interface InvitedToProject {
  id: string
  name: string
  invitedBy: User
}

const Invitations = () => {
  const { data, isLoading, error } = useQuery<InvitedToProject[], ApiError>(
    ['users', 'me', 'recieved-project-invitations'],
    async () => (await api.get('/users/me/recieved-project-invitations')).data
  )

  if (isLoading) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />
  if (error) return <FetchError error={error} />

  return (
    <Box>
      <Text fontSize='4xl' mt={5}>
        Invitations
      </Text>
      <Text my={3} fontSize='md' color='gray.600'>
        See who would like you to contribute to their project.
      </Text>

      <Grid
        templateColumns={{
          base: 'repeat(auto-fit, 1fr)',
          md: 'repeat(auto-fit,400px)'
        }}
        gridGap={{ base: '10px', md: '20px' }}
        mb={4}
      >
        {data?.map(x => (
          <VStack
            key={x.id}
            border='solid 1px'
            borderColor='gray.200'
            borderRadius='xl'
            alignItems='stretch'
            p={4}
          >
            <UserItem user={x.invitedBy} />

            <HStack wrap='wrap' py={5}>
              <Text>has invited you to contribute to </Text>
              <Text noOfLines={3} fontWeight='500'>
                {x.name}
              </Text>
            </HStack>

            <ButtonGroup isAttached alignSelf='flex-end' alignItems='flex-end' flex='1'>
              <Button variant='primary'>Accept</Button>
              <Button>Reject</Button>
            </ButtonGroup>
          </VStack>
        ))}
      </Grid>
    </Box>
  )
}

export default Invitations
