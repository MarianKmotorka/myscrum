import { Button, IconButton } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { AddIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/layout'
import { FiRefreshCcw } from 'react-icons/fi'
import { useProjects } from 'services/ProjectsProvider'
import CreateSprintModal from './CreateSprintModal'

const Sprints = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { selectedProject } = useProjects()

  return (
    <Box mb={3}>
      <Text fontSize='4xl' mt={5}>
        Sprints
        {/* <IconButton aria-label='refresh' ml={4} onClick={refetch} isLoading={isFetching}>
          <FiRefreshCcw />
        </IconButton> */}
      </Text>

      <Text my={3} fontSize='md' color='gray.600'>
        Iterations of work within your project
      </Text>

      {selectedProject?.amIOwner && (
        <Button variant='primaryOutline' mt={6} leftIcon={<AddIcon />} onClick={onOpen}>
          Create sprint
        </Button>
      )}

      <CreateSprintModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Sprints
