import { Box, Spinner, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { css } from '@emotion/react'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import { WorkItem } from 'domainTypes'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useSelectedProject } from 'services/ProjectsProvider'
import { apiErrorToast } from 'services/toastService'
import useReactiveRef from 'utils/hooks/useReactiveRef'
import Row from './Row'

interface WorkItemsTableProps {
  items: WorkItem[]
  sprintId: string | undefined
  rowMenuOptions?: {
    linkToExistingItemOptions?: { moveToParentsSprint?: boolean }
  }
  refetch: () => Promise<void>
}

const WorkItemsTable = ({ items, sprintId, rowMenuOptions, refetch }: WorkItemsTableProps) => {
  const { id: projectId } = useSelectedProject()
  const [fetching, setFetching] = useState(false)
  const rowMenuOptionsRef = useReactiveRef(rowMenuOptions)

  const changePriority = async (id: string, priority: number) => {
    setFetching(true)
    try {
      await api.patch(`/work-items/${id}/priority`, { priority, projectId })
      await refetch()
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
    setFetching(false)
  }

  return (
    <Box overflowX='auto' pb='150px'>
      <Spinner color='gray.500' mb={1} ml={2} visibility={fetching ? 'visible' : 'hidden'} />

      <Table
        minW={600}
        size='sm'
        css={css`
          td,
          th {
            border-color: transparent;
          }
        `}
      >
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>State</Th>
            <Th>Assigned To</Th>
            <Th>Sprint</Th>
            <Th isNumeric>Remaining Hours</Th>
          </Tr>
        </Thead>

        <Tbody>
          <DndProvider backend={HTML5Backend}>
            {items.map(x => (
              <Row
                sprintId={sprintId}
                refetch={refetch}
                key={x.id}
                item={x}
                onPriorityChange={changePriority}
                menuOptions={rowMenuOptionsRef.current}
              />
            ))}
          </DndProvider>
        </Tbody>
      </Table>
    </Box>
  )
}

export default WorkItemsTable
