import { WorkItem } from 'domainTypes'
import api from 'api/httpClient'
import { apiErrorToast } from 'services/toastService'
import { ApiError } from 'api/types'
import { useSelectedProject } from 'services/ProjectsProvider'
import { Box, Button, Image, Input, ModalBody, ModalFooter, Spinner, Text } from '@chakra-ui/react'
import { useState } from 'react'
import useDebounce from 'utils/hooks/useDebounce'
import { useQuery } from 'react-query'
import FetchError from 'components/elements/FetchError'
import { allowedChildWorkItemsMap, workItemTypeToImageMap } from 'utils'
import { CheckIcon } from '@chakra-ui/icons'

interface LinkExistingItemModalContentProps {
  workItem: WorkItem
  sprintId: string | undefined
  onClose: () => void
}

const LinkExistingItemModalContent = ({
  workItem,
  sprintId,
  onClose
}: LinkExistingItemModalContentProps) => {
  const { id: projectId } = useSelectedProject()
  const [linkedIds, setLinkedIds] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const { data, isLoading, error } = useQuery<WorkItem[], ApiError>(
    [
      'work-items',
      'selector',
      {
        sprintId,
        projectId,
        titleFilter: debouncedSearch
      }
    ],
    async () =>
      (
        await api.post('/work-items/selector', {
          sprintId,
          projectId,
          titleFilter: debouncedSearch
        })
      ).data
  )

  const callApi = async (childId: string) => {
    if (linkedIds.includes(childId)) return

    try {
      await api.patch(`/work-items/${workItem.id}/child-work-item`, {
        childWorkItemId: childId,
        projectId
      })
      setLinkedIds(prev => [...prev, childId])
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
          placeholder='Search work items'
        />

        {isLoading && <Spinner />}

        <Box maxH='400px' overflowY='auto' mt={6}>
          {data
            ?.filter(x => x.id !== workItem.id)
            ?.filter(x => x.parentId !== workItem.id)
            ?.filter(x => allowedChildWorkItemsMap[workItem.type].includes(x.type))
            ?.map(x => (
              <Box key={x.id} d='flex' alignItems='center' py={1}>
                <Image
                  width='15px'
                  objectFit='contain'
                  maxH='15px'
                  src={workItemTypeToImageMap[x.type]}
                  mr={2}
                />

                <Text noOfLines={1}>{x.title}</Text>

                <Button ml='auto' size='sm' onClick={async () => await callApi(x.id)}>
                  {linkedIds.includes(x.id) ? <CheckIcon /> : 'Link'}
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

export default LinkExistingItemModalContent
