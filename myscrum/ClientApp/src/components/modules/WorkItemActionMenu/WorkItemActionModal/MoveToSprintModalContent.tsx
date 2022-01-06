import { Box, Button, Input, ModalBody, ModalFooter, Spinner, Text } from '@chakra-ui/react'
import { Sprint } from 'domainTypes'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'
import useDebounce from 'utils/hooks/useDebounce'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import FetchError from 'components/elements/FetchError'
import { apiErrorToast } from 'services/toastService'
import { CheckIcon } from '@chakra-ui/icons'
import { WorkItemActionMenuProps } from '../WorkItemActionMenu'

interface MoveToSprintModalContentProps {
  workItem: WorkItemActionMenuProps['workItem']
  onClose: () => void
}

const MoveToSprintModalContent = ({ workItem, onClose }: MoveToSprintModalContentProps) => {
  const { id: projectId } = useSelectedProject()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [movedToSprintId, setMovedToSprintId] = useState<string | undefined>(workItem.sprintId)

  const { data, isLoading, error } = useQuery<Sprint[], ApiError>(
    ['sprints', { projectId, search: debouncedSearch }],
    async () => (await api.get(`/sprints?projectId=${projectId}&search=${debouncedSearch}`)).data
  )

  const callApi = async (targetSprintId: string | undefined) => {
    if (targetSprintId === movedToSprintId) return

    try {
      await api.patch(`/work-items/${workItem.id}/move-to-sprint`, {
        projectId,
        sprintId: targetSprintId
      })
      setMovedToSprintId(targetSprintId)
      queryClient.invalidateQueries(['work-items', { projectId, sprintId: targetSprintId }])
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  if (error) return <FetchError error={error} />

  return (
    <>
      <ModalBody>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search sprints'
        />

        {isLoading && <Spinner />}

        <Button mt={2} onClick={async () => await callApi(undefined)}>
          {!movedToSprintId ? <CheckIcon /> : 'Move to backlog'}
        </Button>

        <Box maxH='400px' overflowY='auto' mt={6}>
          {data?.map(x => (
            <Box key={x.id} d='flex' alignItems='center' py={1}>
              <Text noOfLines={1}>{x.name}</Text>

              <Button ml='auto' size='sm' onClick={async () => await callApi(x.id)}>
                {movedToSprintId === x.id ? <CheckIcon /> : 'Move'}
              </Button>
            </Box>
          ))}
        </Box>
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose}>Done</Button>
      </ModalFooter>
    </>
  )
}

export default MoveToSprintModalContent
