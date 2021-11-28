import { Button, ButtonGroup, IconButton } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { AddIcon } from '@chakra-ui/icons'
import { Box, HStack, Text } from '@chakra-ui/layout'
import { FiRefreshCcw } from 'react-icons/fi'
import { useProjects } from 'services/ProjectsProvider'
import { Sprint } from 'domainTypes'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import CreateSprintModal from './CreateSprintModal/CreateSprintModal'
import { useQuery } from 'react-query'
import { Spinner } from '@chakra-ui/spinner'
import FetchError from 'components/elements/FetchError'
import SprintsTable from './SprintsTable'

const Sprints = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { selectedProject } = useProjects()

  const { data, isLoading, isFetching, error, refetch } = useQuery<Sprint[], ApiError>(
    ['sprints', { projectId: selectedProject?.id }],
    async () => (await api.get(`/sprints?projectId=${selectedProject?.id}`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  const currentSprint = data.find(x => x.isCurrentSprint)

  return (
    <Box mb={3}>
      <HStack mt={5} mb={10}>
        <Text fontSize='4xl' mr={4}>
          Sprints
        </Text>

        <ButtonGroup>
          <IconButton aria-label='refresh' onClick={() => refetch()} isLoading={isFetching}>
            <FiRefreshCcw />
          </IconButton>

          {selectedProject?.amIOwner && (
            <Button leftIcon={<AddIcon />} onClick={onOpen}>
              Create sprint
            </Button>
          )}
        </ButtonGroup>
      </HStack>

      {currentSprint && <SprintsTable data={[currentSprint]} caption='Current sprint' />}

      <SprintsTable data={data} caption='All sprints' />

      {data.length === 0 && (
        <Text mt={5} maxW='250px' border='solid 1px' borderColor='gray.200' color='gray.500' p={5}>
          {'No sprints created so far :('}
        </Text>
      )}

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
