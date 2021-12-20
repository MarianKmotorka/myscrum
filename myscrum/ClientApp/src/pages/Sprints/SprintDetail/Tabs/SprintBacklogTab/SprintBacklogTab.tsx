import { Box, ButtonGroup, Spinner } from '@chakra-ui/react'
import NewWorkItemMenu from 'components/elements/NewWorkItemMenu/NewWorkItemMenu'
import { SprintDetail, WorkItem, WorkItemType } from 'domainTypes'
import toast from 'react-hot-toast'
import api from 'api/httpClient'
import { getApiErrorMessage } from 'utils'
import { useSelectedProject } from 'services/ProjectsProvider'
import { ApiError } from 'api/types'
import { useQuery } from 'react-query'
import FetchError from 'components/elements/FetchError'
import WorkItemsTable from 'components/elements/WorkItemsTable/WorkItemsTable'

interface SprintBacklogProps {
  sprint: SprintDetail
}

const SprintBacklogTab = ({ sprint }: SprintBacklogProps) => {
  const { id: projectId } = useSelectedProject()

  const { data, isLoading, error, refetch } = useQuery<WorkItem[], ApiError>(
    ['work-items', { projectId, sprintId: sprint.id }],
    async () =>
      (
        await api.get(`/work-items`, {
          params: { projectId, sprintId: sprint.id }
        })
      ).data,
    { staleTime: 60_000 }
  )

  const handleNewItem = async (value: { type: WorkItemType; title: string }) => {
    await toast.promise(api.post('/work-items', { ...value, projectId, sprintId: sprint.id }), {
      loading: 'Creating...',
      success: `${value.title} created.`,
      error: getApiErrorMessage
    })
    refetch()
  }

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='2px' color='gray.500' size='lg' mt='20px' />

  return (
    <Box>
      <ButtonGroup size='sm' mb={2} mt={4}>
        <NewWorkItemMenu
          onSelected={handleNewItem}
          allowedTypes={[WorkItemType.Pbi, WorkItemType.Bug, WorkItemType.TestCase]}
        />
      </ButtonGroup>

      <WorkItemsTable
        items={data}
        refetch={async () => {
          await refetch()
        }}
      />
    </Box>
  )
}

export default SprintBacklogTab
