import { useEffect } from 'react'
import { ApiError } from 'api/types'
import { User } from 'domainTypes'
import { useQuery, useQueryClient } from 'react-query'
import api from 'api/httpClient'
import { Spinner } from '@chakra-ui/spinner'
import FetchError from 'components/elements/FetchError'
import { Box, Grid, HStack, Text, VStack } from '@chakra-ui/layout'
import { Button, ButtonGroup, IconButton } from '@chakra-ui/button'
import UserItem from 'components/elements/UserItem'
import { apiErrorToast, successToast } from 'services/toastService'
import { useProjects } from 'services/ProjectsProvider'
import { FiRefreshCcw } from 'react-icons/fi'
import { useAuthorizedUser } from 'services/auth/AuthProvider'

interface InvitedToProject {
  id: string
  name: string
  invitedBy: User
}

const Invitations = () => {
  const queryClient = useQueryClient()
  const { refetch: refetchProjects } = useProjects()
  const { updateUser, currentUser } = useAuthorizedUser()
  const { data, isLoading, error, refetch, isFetching } = useQuery<InvitedToProject[], ApiError>(
    ['users', 'me', 'recieved-project-invitations'],
    async () => (await api.get('/users/me/recieved-project-invitations')).data
  )

  useEffect(() => {
    if (!data) return
    updateUser({ projectInvitationCount: data.length })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const acceptOrReject = async (accepted: boolean, projectId: string) => {
    try {
      await api.post(`/projects/${projectId}/accept-reject-invitation`, { accepted })
      successToast(accepted ? 'Invitation was accepted.' : 'Invitation was rejected.')
      updateUser({ projectInvitationCount: currentUser.projectInvitationCount - 1 })
      queryClient.setQueryData<InvitedToProject[]>(
        ['users', 'me', 'recieved-project-invitations'],
        prev => (prev ? prev.filter(x => x.id !== projectId) : [])
      )
      if (accepted) await refetchProjects()
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  if (isLoading) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />
  if (error) return <FetchError error={error} />

  return (
    <Box>
      <Text fontSize='4xl' mt={5}>
        Invitations
        <IconButton aria-label='refresh' ml={4} onClick={() => refetch()} isLoading={isFetching}>
          <FiRefreshCcw />
        </IconButton>
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
        my={7}
      >
        {data?.length === 0 && (
          <Text border='solid 1px' borderColor='gray.200' color='gray.500' p={5}>
            {'No invitations so far :('}
          </Text>
        )}

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
              <Button variant='primary' onClick={() => acceptOrReject(true, x.id)}>
                Accept
              </Button>
              <Button onClick={() => acceptOrReject(false, x.id)}>Reject</Button>
            </ButtonGroup>
          </VStack>
        ))}
      </Grid>
    </Box>
  )
}

export default Invitations
