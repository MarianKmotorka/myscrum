import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, HStack, Image, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { WorkItem } from 'domainTypes'
import { useState } from 'react'
import { workItemStateToTextColorMap, workItemTypeToImageMap } from 'utils'

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
            border: none;
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
          {items.map(x => (
            <Row item={x} />
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

interface RowProps {
  item: WorkItem
  levelOfNesting?: number
}

const Row = ({
  item: { id, title, children, type, state, assignedTo, remainingHours },
  levelOfNesting = 0
}: RowProps) => {
  const [expanded, setExpanded] = useState(false)

  const iconProps = {
    visibility: children.length ? 'visible' : 'hidden',
    cursor: 'pointer',
    fontSize: 'lg',
    mr: '3px',
    onClick: () => setExpanded(prev => !prev)
  } as const

  return (
    <>
      <Tr key={id} _hover={{ bg: 'rgba(0,0,0,0.05)' }} transition='0.1s'>
        <Td display='flex' alignItems='center' pl={`${levelOfNesting * 32}px`} title={title}>
          {expanded ? <ChevronDownIcon {...iconProps} /> : <ChevronRightIcon {...iconProps} />}

          <Image
            width='15px'
            objectFit='contain'
            maxH='15px'
            src={workItemTypeToImageMap[type]}
            mr={2}
          />

          <Text noOfLines={1}>{title}</Text>
        </Td>

        <Td>
          <HStack alignItems='center'>
            <Box
              width='8px'
              height='8px'
              borderRadius='50%'
              bg={workItemStateToTextColorMap[state].color}
            />
            <Text noOfLines={1}>{workItemStateToTextColorMap[state].text}</Text>
          </HStack>
        </Td>

        <Td>
          <Text noOfLines={1}>{assignedTo?.fullName}</Text>
        </Td>

        <Td isNumeric>
          <Text noOfLines={1}>{remainingHours}</Text>
        </Td>
      </Tr>

      {expanded && children.map(x => <Row item={x} levelOfNesting={levelOfNesting + 1} />)}
    </>
  )
}

export default WorkItemsTable
