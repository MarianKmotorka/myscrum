import { ArrowForwardIcon, LinkIcon, PlusSquareIcon } from '@chakra-ui/icons'
import {
  Box,
  Icon,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@chakra-ui/react'
import { WorkItem, WorkItemType } from 'domainTypes'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import LinkNewItemModalContent from './LinkNewItemModalContent'

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
  const items = [WorkItemType.Task, WorkItemType.TestCase].includes(workItem.type)
    ? rowMenuItems.filter(x => x.action !== 'linkExisting' && x.action !== 'linkNew')
    : rowMenuItems

  return (
    <>
      <Popover placement='right-start'>
        <PopoverTrigger>
          <Icon className='dots-icon' cursor='pointer' fontSize='lg' ml='auto' visibility='hidden'>
            <BsThreeDots />
          </Icon>
        </PopoverTrigger>

        <PopoverContent
          boxShadow='xl'
          maxW='200px'
          border='none'
          _focus={{ boxShadow: 'xl', outline: 'none' }}
          overflow='hidden'
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
        </PopoverContent>
      </Popover>

      {action && (
        <Modal isOpen onClose={() => setAction(undefined)}>
          <ModalOverlay />

          <ModalContent borderLeft='solid 6px' borderColor='gray.200'>
            <ModalHeader alignItems='center' d='flex' gridGap={3}>
              {actionItem?.icon} {actionItem?.name}
            </ModalHeader>

            <ModalCloseButton />

            {action === 'linkNew' && (
              <LinkNewItemModalContent
                workItem={workItem}
                sprintId={sprintId}
                refetch={refetch}
                onClose={() => setAction(undefined)}
              />
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default RowMenu
