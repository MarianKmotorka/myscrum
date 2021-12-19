import { Box, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { WorkItem } from 'domainTypes'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Row from './Row'

interface WorkItemsTableProps {
  items: WorkItem[]
}

const WorkItemsTable = ({ items }: WorkItemsTableProps) => {
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
              <Row key={x.id} item={x} />
            ))}
          </DndProvider>
        </Tbody>
      </Table>
    </Box>
  )
}

export default WorkItemsTable
