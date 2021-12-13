import { Box } from '@chakra-ui/react'
import WorkItemMenu from 'components/elements/WorkItemMenu/WorkItemMenu'
import { WorkItemType } from 'domainTypes'

interface SprintBacklogProps {}

const allowedWorkItemTypes = [
  WorkItemType.Task,
  WorkItemType.Pbi,
  WorkItemType.Bug,
  WorkItemType.TestCase
]

const SprintBacklogTab = ({}: SprintBacklogProps) => {
  const handleNewItem = (type: WorkItemType) => {
    console.log('sleected', type)
  }

  return (
    <Box>
      <WorkItemMenu
        onSelected={handleNewItem}
        allowedTypes={allowedWorkItemTypes}
        menuButtonProps={{ children: 'New item' }}
      />
    </Box>
  )
}

export default SprintBacklogTab
