import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, HStack, Image, Td, Text, Tr } from '@chakra-ui/react'
import { WorkItem } from 'domainTypes'
import { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { workItemStateToTextColorMap, workItemTypeToImageMap } from 'utils'
import { shouldDropAbove } from './utils'

interface RowProps {
  item: WorkItem
  levelOfNesting?: number
}

interface DragItem {
  id: string
  dropAbove?: boolean
}

const Row = ({ item, levelOfNesting = 0 }: RowProps) => {
  const { title, children, type, state, assignedTo, remainingHours } = item
  const [expanded, setExpanded] = useState(false)
  const [dropAbove, setDropAbove] = useState<boolean>()
  const rowRef = useRef<HTMLTableRowElement>(null!)
  const dragItemType = `levelOfNesting-${levelOfNesting}`

  const [, drag] = useDrag<DragItem, WorkItem, {}>(() => ({
    type: dragItemType,
    item,
    end: ({ id, dropAbove }, monitor) => {
      const dropResult = monitor.getDropResult()
      if (id === dropResult?.id) return
      console.log(dropAbove ? 'ABOVE' : 'BELLOW', monitor.getDropResult()?.title)
    }
  }))

  const [{ canDrop, isOver }, drop] = useDrop<
    DragItem,
    WorkItem,
    { canDrop: boolean; isOver: boolean }
  >({
    accept: dragItemType,
    drop: () => item,
    hover: (item, monitor) => {
      const value = shouldDropAbove(monitor, rowRef)
      setDropAbove(value)
      item.dropAbove = value
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver()
    })
  })

  drag(drop(rowRef))
  const borderCss = 'solid 2px var(--chakra-colors-primary)'
  const canDropAbove = isOver && canDrop && dropAbove
  const canDropBellow = isOver && canDrop && !dropAbove
  const iconProps = {
    visibility: children.length ? 'visible' : 'hidden',
    cursor: 'pointer',
    fontSize: 'lg',
    mr: '3px',
    onClick: () => setExpanded(prev => !prev)
  } as const

  return (
    <>
      <Tr
        ref={rowRef}
        _hover={{ bg: 'rgba(0,0,0,0.05)' }}
        border={borderCss}
        borderX='none'
        borderTopColor={canDropAbove ? 'primary' : 'transparent'}
        borderBottom={canDropBellow ? 'primary' : 'transparent'}
      >
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

      {expanded &&
        children.map(x => <Row key={x.id} item={x} levelOfNesting={levelOfNesting + 1} />)}
    </>
  )
}

export default Row