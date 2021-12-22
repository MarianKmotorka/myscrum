import { ArrowForwardIcon, LinkIcon, PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box,
  HStack,
  Icon,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import { WorkItem, WorkItemType } from 'domainTypes'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { workItemTypeToColorMap, workItemTypeToImageMap } from 'utils'
import LinkExistingItemModalContent from './LinkExistingItemModalContent'
import LinkNewItemModalContent from './LinkNewItemModalContent'
import MoveToSprintModalContent from './MoveToSprintModalContent'

interface RowMenuProps {
  workItem: WorkItem
  sprintId: string | undefined
  refetch: () => Promise<any>
}

type RowMenuAction = 'linkNew' | 'linkExisting' | 'move'

const rowMenuItems: Array<{ name: string; action: RowMenuAction; icon: JSX.Element }> = [
  {
    name: 'Link new item',
    action: 'linkNew',
    icon: <LinkIcon />
  },
  {
    name: 'Link existing item',
    action: 'linkExisting',
    icon: <PlusSquareIcon />
  },
  {
    name: 'Move to sprint',
    action: 'move',
    icon: <ArrowForwardIcon />
  }
]

const RowMenu = ({ workItem, sprintId, refetch }: RowMenuProps) => {
  const [action, setAction] = useState<RowMenuAction>()
  const actionItem = rowMenuItems.find(x => x.action === action)
  const items = (() => {
    if ([WorkItemType.Task, WorkItemType.TestCase].includes(workItem.type))
      return rowMenuItems.filter(x => x.action !== 'linkExisting' && x.action !== 'linkNew')

    if ([WorkItemType.Epic, WorkItemType.Feature].includes(workItem.type))
      return rowMenuItems.filter(x => x.action !== 'move')

    return rowMenuItems
  })()

  const handleClose = async () => {
    await refetch()
    setAction(undefined)
  }

  return (
    <>
      <Box ml='auto' role='group' position='relative'>
        <Icon className='dots-icon' cursor='pointer' fontSize='lg' visibility='hidden'>
          <BsThreeDots />
        </Icon>

        <Box
          boxShadow='xl'
          width='200px'
          border='none'
          _focus={{ boxShadow: 'xl', outline: 'none' }}
          _groupHover={{ display: 'block' }}
          overflow='hidden'
          display='none'
          borderRadius={8}
          bg='white'
          top='0px'
          left='100%'
          position='absolute'
          mb={5}
        >
          {items.map(({ name, action, icon }) => (
            <Box
              key={action}
              d='flex'
              alignItems='center'
              p={3}
              gridGap={3}
              cursor='pointer'
              _hover={{ bg: 'gray.50' }}
              onClick={() => setAction(action as RowMenuAction)}
            >
              {icon}
              {name}
            </Box>
          ))}
        </Box>
      </Box>

      {action && (
        <Modal isOpen onClose={handleClose} size='lg'>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>
              <Box borderLeft={`solid 5px ${workItemTypeToColorMap[workItem.type]}`} pl={2}>
                <Text>{actionItem?.name}</Text>

                <HStack>
                  <Image
                    width='15px'
                    objectFit='contain'
                    maxH='15px'
                    src={workItemTypeToImageMap[workItem.type]}
                  />
                  <Text fontSize='sm' color='gray.500' d='flex' fontWeight={500} noOfLines={1}>
                    {workItem.title}
                  </Text>
                </HStack>
              </Box>
            </ModalHeader>

            <ModalCloseButton />

            {action === 'linkNew' && (
              <LinkNewItemModalContent
                workItem={workItem}
                sprintId={sprintId}
                onClose={handleClose}
              />
            )}

            {action === 'linkExisting' && (
              <LinkExistingItemModalContent
                workItem={workItem}
                sprintId={sprintId}
                onClose={handleClose}
              />
            )}

            {action === 'move' && (
              <MoveToSprintModalContent workItem={workItem} onClose={handleClose} />
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default RowMenu
