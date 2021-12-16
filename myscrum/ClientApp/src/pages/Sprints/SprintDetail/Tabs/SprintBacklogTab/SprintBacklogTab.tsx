import { Box } from '@chakra-ui/react'
import NewWorkItemMenu from 'components/elements/NewWorkItemMenu/NewWorkItemMenu'
import { SprintDetail, WorkItemType } from 'domainTypes'
import toast from 'react-hot-toast'
import api from 'api/httpClient'
import { getApiErrorMessage } from 'utils'
import { useSelectedProject } from 'services/ProjectsProvider'

interface SprintBacklogProps {
  sprint: SprintDetail
}

const SprintBacklogTab = ({ sprint }: SprintBacklogProps) => {
  const { id } = useSelectedProject()

  const handleNewItem = (value: { type: WorkItemType; title: string }) => {
    toast.promise(api.post('/work-items', { ...value, projectId: id, sprintId: sprint.id }), {
      loading: 'Creating...',
      success: `${value.title} created.`,
      error: getApiErrorMessage
    })
  }

  return (
    <Box>
      <NewWorkItemMenu
        onSelected={handleNewItem}
        allowedTypes={[WorkItemType.Pbi, WorkItemType.Bug, WorkItemType.TestCase]}
      />
    </Box>
  )
}

export default SprintBacklogTab
