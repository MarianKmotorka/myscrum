import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, HStack, Image, Td, Text, Tr } from '@chakra-ui/react'
import { WorkItem } from 'domainTypes'
import { useState } from 'react'
import { useDrag } from 'react-dnd'
import { workItemStateToTextColorMap, workItemTypeToImageMap } from 'utils'

interface RowProps {
  item: WorkItem
  levelOfNesting?: number
}

const Row = ({
  item: { id, title, children, type, state, assignedTo, remainingHours },
  levelOfNesting = 0
}: RowProps) => {
  const [expanded, setExpanded] = useState(false)

  const [, drag] = useDrag(() => ({
    type: 'row',
    item: { id }
  }))

  const iconProps = {
    visibility: children.length ? 'visible' : 'hidden',
    cursor: 'pointer',
    fontSize: 'lg',
    mr: '3px',
    onClick: () => setExpanded(prev => !prev)
  } as const

  return (
    <>
      <Tr key={id} ref={drag} _hover={{ bg: 'rgba(0,0,0,0.05)' }} transition='0.1s'>
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

export default Row
