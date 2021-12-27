import { ApiError } from 'api/types'
import { DiscussionMessage } from 'domainTypes'
import { useQuery } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Box, Spinner, VStack } from '@chakra-ui/react'
import NewMessage from './NewMessage'
import Message from './Message'
import { AnimatePresence } from 'framer-motion'

interface DiscussionProps {
  workItemId: string
}

const Discussion = ({ workItemId }: DiscussionProps) => {
  const { id: projectId } = useSelectedProject()
  const { data, isLoading, error } = useQuery<DiscussionMessage[], ApiError>(
    ['work-items', workItemId, 'discussion-messages'],
    async () =>
      (await api.get(`/work-items/${workItemId}/discussion-messages`, { params: { projectId } }))
        .data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return (
    <Box maxW='600px' pt={5}>
      <NewMessage workItemId={workItemId} />

      <VStack alignItems='stretch' mt={10} spacing={3}>
        <AnimatePresence>
          {data.map(x => (
            <Message message={x} key={x.id} />
          ))}
        </AnimatePresence>
      </VStack>
    </Box>
  )
}

export default Discussion
