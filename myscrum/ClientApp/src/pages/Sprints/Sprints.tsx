import { Button, IconButton } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { AddIcon } from '@chakra-ui/icons'
import { Box, Text, VStack } from '@chakra-ui/layout'
import { FiRefreshCcw } from 'react-icons/fi'
import { useProjects } from 'services/ProjectsProvider'
import { Sprint } from 'domainTypes'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import CreateSprintModal from './CreateSprintModal/CreateSprintModal'
import { useQuery } from 'react-query'
import { Spinner } from '@chakra-ui/spinner'
import FetchError from 'components/elements/FetchError'

const Sprints = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { selectedProject } = useProjects()

  const { data, isLoading, isFetching, error, refetch } = useQuery<Sprint[], ApiError>(
    ['sprints', { projectId: selectedProject?.id }],
    async () => (await api.get(`/sprints?projectId=${selectedProject?.id}`)).data
  )

  if (isLoading) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />
  if (error) return <FetchError error={error} />

  return (
    <Box mb={3}>
      <Text fontSize='4xl' mt={5}>
        Sprints
        <IconButton aria-label='refresh' ml={4} onClick={() => refetch()} isLoading={isFetching}>
          <FiRefreshCcw />
        </IconButton>
      </Text>

      <Text my={3} fontSize='md' color='gray.600'>
        Iterations of work within your project
      </Text>

      {selectedProject?.amIOwner && (
        <Button variant='primaryOutline' mt={5} leftIcon={<AddIcon />} onClick={onOpen}>
          Create sprint
        </Button>
      )}

      <VStack alignItems='stretch' mt={5} spacing={0}>
        {data?.length === 0 && (
          <Text maxW='250px' border='solid 1px' borderColor='gray.200' color='gray.500' p={5}>
            {'No sprints created so far :('}
          </Text>
        )}

        {data?.map(x => (
          <Box
            key={x.id}
            color={x.isCurrentSprint ? 'primary' : 'gray.800'}
            fontWeight={x.isCurrentSprint ? '500' : '400'}
            px={2}
            py={3}
            borderBottom='solid 1px'
            borderColor='gray.200'
          >
            {x.name}
          </Box>
        ))}
      </VStack>

      <CreateSprintModal
        isOpen={isOpen}
        onClose={onClose}
        refetch={async () => {
          await refetch()
        }}
      />
    </Box>
  )
}

export default Sprints
