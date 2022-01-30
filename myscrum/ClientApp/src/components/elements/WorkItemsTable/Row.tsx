import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, HStack, Image, Td, Text, Tr } from '@chakra-ui/react'
import { css } from '@emotion/react'
import { WorkItem } from 'domainTypes'
import { canSetRemainingHours } from 'pages/WorkItemDetail/Tabs/Details/utils'
import { useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'
import {
  getComputedRemainingHours,
  workItemStateToTextColorMap,
  workItemTypeToImageMap
} from 'utils'
import WorkItemActionMenu from '../../modules/WorkItemActionMenu/WorkItemActionMenu'
import { shouldDropAbove } from './utils'

interface RowProps {
  item: WorkItem
  sprintId: string | undefined
  levelOfNesting?: number
  onPriorityChange: (id: string, newPriority: number) => Promise<void>
  refetch: () => Promise<any>
}

interface DragItem {
  id: string
  dropAbove?: boolean
}

const Row = ({ item, sprintId, onPriorityChange, refetch, levelOfNesting = 0 }: RowProps) => {
  const { id, title, children, type, state, assignedTo, remainingHours, sprintName } = item
  const [expanded, setExpanded] = useState(false)
  const [dropAbove, setDropAbove] = useState<boolean>()
  const rowRef = useRef<HTMLTableRowElement>(null!)
  const dragItemType = `levelOfNesting-${levelOfNesting}`

  const [, drag] = useDrag<DragItem, WorkItem, {}>(() => ({
    type: dragItemType,
    item,
    end: ({ id, dropAbove }, monitor) => {
      const dropResult = monitor.getDropResult()
      if (id === dropResult?.id || !dropResult) return

      const newPriority = dropAbove ? dropResult.priority : dropResult.priority + 1
      onPriorityChange(id, newPriority)
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
        css={css`
          :hover {
            background: var(--chakra-colors-bg2);
            .dots-icon {
              visibility: visible;
            }
          }
        `}
        border={borderCss}
        borderX='none'
        borderTopColor={canDropAbove ? 'primary' : 'transparent'}
        borderBottom={canDropBellow ? 'primary' : 'transparent'}
      >
        <Td display='flex' alignItems='center' pl={`${levelOfNesting * 32}px`}>
          {expanded ? <ChevronDownIcon {...iconProps} /> : <ChevronRightIcon {...iconProps} />}

          <Image
            width='15px'
            objectFit='contain'
            maxH='15px'
            src={workItemTypeToImageMap[type]}
            mr={2}
          />

          <Link to={`/work-items/${id}`}>
            <Text
              noOfLines={1}
              title={title}
              _hover={{ textDecoration: 'underline', color: 'blue.500' }}
            >
              {title}
            </Text>
          </Link>

          <Box ml='auto'>
            <WorkItemActionMenu
              workItem={item}
              refetch={refetch}
              sprintId={sprintId}
              visibleOnlyOnHover
            />
          </Box>
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

        <Td>
          {item.sprintId && (
            <Link to={`/sprints/${item.sprintId}`}>
              <Text _hover={{ textDecoration: 'underline', color: 'blue.500' }} noOfLines={1}>
                {sprintName}
              </Text>
            </Link>
          )}
        </Td>

        <Td isNumeric>
          <Text noOfLines={1}>
            {canSetRemainingHours(type) ? remainingHours : getComputedRemainingHours(children)}
          </Text>
        </Td>
      </Tr>

      {expanded &&
        children.map(x => (
          <Row
            key={x.id}
            item={x}
            sprintId={sprintId}
            refetch={refetch}
            levelOfNesting={levelOfNesting + 1}
            onPriorityChange={onPriorityChange}
          />
        ))}
    </>
  )
}

export default Row
