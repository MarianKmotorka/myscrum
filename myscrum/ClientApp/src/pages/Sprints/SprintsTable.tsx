import { Text } from '@chakra-ui/layout'
import { Table, TableCaption, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/table'
import { css } from '@emotion/react'
import { Sprint } from 'domainTypes'
import moment from 'moment'
import { Link } from 'react-router-dom'

interface SprintsTableProps {
  data: Sprint[]
  caption: string
}

const SprintsTable = ({ data, caption }: SprintsTableProps) => {
  const formatDate = (date: string) => moment(date).format('DD MMM YYYY')

  return (
    <Table minW={600} mt={10} variant='striped'>
      <TableCaption placement='top' textAlign='start'>
        {caption}
      </TableCaption>

      <Thead>
        <Tr
          css={css`
            > th {
              border: none;
            }
          `}
        >
          <Th>Name</Th>
          <Th minW='150px'>Start date</Th>
          <Th minW='150px'>End date</Th>
        </Tr>
      </Thead>

      <Tbody>
        {data.map(x => (
          <Tr
            key={x.id}
            css={css`
              > td {
                border: none;
              }

              :nth-of-type(odd) td {
                background: var(--chakra-colors-bg2) !important;
              }
            `}
          >
            <Td
              fontWeight={x.isCurrentSprint ? '500' : '400'}
              color={x.isCurrentSprint ? 'secondary' : undefined}
              _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
              <Link to={`/sprints/${x.id}`}>
                <Text noOfLines={1}>{x.name}</Text>
              </Link>
            </Td>
            <Td>{formatDate(x.startDate)}</Td>
            <Td>{formatDate(x.endDate)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default SprintsTable
