import { Box, ButtonGroup, HStack, IconButton, Spinner, Text } from '@chakra-ui/react'
import { WorkItem, WorkItemType } from 'domainTypes'
import toast from 'react-hot-toast'
import { FiRefreshCcw } from 'react-icons/fi'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import { getApiErrorMessage } from 'utils'
import NewWorkItemMenu from 'components/elements/NewWorkItemMenu/NewWorkItemMenu'
import FetchError from 'components/elements/FetchError'
import { useQuery } from 'react-query'
import { ApiError } from 'api/types'

const Backlog = () => {
  const { id: projectId } = useSelectedProject()

  const { data, isLoading, error, refetch } = useQuery<WorkItem[], ApiError>(
    ['work-items', { projectId }],
    async () => (await api.get(`/work-items`, { params: { projectId } })).data,
    { staleTime: 60_000 }
  )

  const handleNewItem = async (value: { type: WorkItemType; title: string }) => {
    await toast.promise(api.post('/work-items', { ...value, projectId }), {
      loading: 'Creating...',
      success: `${value.title} created.`,
      error: getApiErrorMessage
    })
    refetch()
  }

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return (
    <Box mb={3}>
      <HStack mt={5}>
        <Text fontSize='4xl'>Backlog</Text>

        <ButtonGroup alignItems='center'>
          <IconButton variant='bgGhost' aria-label='refresh' ml={4}>
            <FiRefreshCcw />
          </IconButton>

          <NewWorkItemMenu
            onSelected={handleNewItem}
            allowedTypes={[
              WorkItemType.Pbi,
              WorkItemType.Feature,
              WorkItemType.Epic,
              WorkItemType.Bug,
              WorkItemType.TestCase
            ]}
          />
        </ButtonGroup>
      </HStack>

      <Text my={3} fontSize='md' color='gray.700'>
        This is your project backlog with all items that has not been assigned to any sprint.
      </Text>

      {data.map(x => (
        <p key={x.id}>{x.title}</p>
      ))}
    </Box>
  )
}

export default Backlog
