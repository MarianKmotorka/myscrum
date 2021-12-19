import { Box, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { css } from '@emotion/react'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import { WorkItem } from 'domainTypes'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useSelectedProject } from 'services/ProjectsProvider'
import { apiErrorToast } from 'services/toastService'
import Row from './Row'

interface WorkItemsTableProps {
  items: WorkItem[]
  refetch: () => void
}

const WorkItemsTable = ({ items, refetch }: WorkItemsTableProps) => {
  const { id: projectId } = useSelectedProject()
  const changePriority = async (id: string, priority: number) => {
    try {
      await api.patch(`/work-items/${id}/priority`, { priority, projectId })
      refetch()
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  return (
    <Box overflowX='auto'>
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
            <Th isNumeric>Remaining Hours</Th>
          </Tr>
        </Thead>

        <Tbody>
          <DndProvider backend={HTML5Backend}>
            {items.map(x => (
              <Row key={x.id} item={x} onPriorityChange={changePriority} />
            ))}
          </DndProvider>
        </Tbody>
      </Table>
    </Box>
  )
}

export default WorkItemsTable
