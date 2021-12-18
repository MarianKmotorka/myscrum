import { Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { WorkItem } from 'domainTypes'
import { workItemTypeToImageMap } from 'utils'

interface WorkItemsTableProps {
  items: WorkItem[]
}

const WorkItemsTable = ({ items }: WorkItemsTableProps) => {
  return (
    <Table
      minW={600}
      mt={10}
      size='sm'
      css={css`
        td {
          border: none;
        }
      `}
    >
      <Thead>
        <Tr>
          <Th>Title</Th>
        </Tr>
      </Thead>

      <Tbody>
        {items.map(x => (
          <Tr key={x.id}>
            <Td display='flex'>
              <Image
                width='15px'
                objectFit='contain'
                maxH='15px'
                src={workItemTypeToImageMap[x.type]}
                mr={2}
              />
              {x.title}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default WorkItemsTable
