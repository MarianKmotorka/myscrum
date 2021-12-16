import { Box, ButtonGroup, HStack, IconButton, Text } from '@chakra-ui/react'
import { WorkItemType } from 'domainTypes'
import toast from 'react-hot-toast'
import { FiRefreshCcw } from 'react-icons/fi'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import { getApiErrorMessage } from 'utils'
import NewWorkItemMenu from 'components/elements/NewWorkItemMenu/NewWorkItemMenu'

const Backlog = () => {
  const { id } = useSelectedProject()

  const handleNewItem = (value: { type: WorkItemType; title: string }) => {
    toast.promise(api.post('/work-items', { ...value, projectId: id }), {
      loading: 'Creating...',
      success: `${value.title} created.`,
      error: getApiErrorMessage
    })
  }

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
    </Box>
  )
}

export default Backlog
