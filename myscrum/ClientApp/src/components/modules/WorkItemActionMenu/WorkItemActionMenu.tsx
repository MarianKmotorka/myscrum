import { ArrowForwardIcon, LinkIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { Box, Icon } from '@chakra-ui/react'
import WorkItemActionModal, {
  WorkItemAction
} from 'components/modules/WorkItemActionMenu/WorkItemActionModal/WorkItemActionModal'
import { WorkItemType } from 'domainTypes'
import { useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { allowedChildWorkItemsMap } from 'utils'

export interface WorkItemActionMenuProps {
  workItem: { id: string; type: WorkItemType; title: string; sprintId?: string }
  sprintId: string | undefined
  visibleOnlyOnHover?: boolean
  moveToSprintDisabled?: boolean
  refetch: () => Promise<any>
}

const rowMenuItems: Array<{ name: string; action: WorkItemAction; icon: JSX.Element }> = [
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

const WorkItemActionMenu = ({
  workItem,
  sprintId,
  visibleOnlyOnHover,
  moveToSprintDisabled,
  refetch
}: WorkItemActionMenuProps) => {
  const [action, setAction] = useState<WorkItemAction>()
  const actionItem = rowMenuItems.find(x => x.action === action)
  const items = (() => {
    let output = rowMenuItems

    if (moveToSprintDisabled) output = output.filter(x => x.action !== 'move')

    if (allowedChildWorkItemsMap[workItem.type].length === 0)
      output = output.filter(x => x.action !== 'linkExisting' && x.action !== 'linkNew')

    if ([WorkItemType.Epic, WorkItemType.Feature].includes(workItem.type))
      output = output.filter(x => x.action !== 'move')

    return output
  })()

  const handleClose = async () => {
    await refetch()
    setAction(undefined)
  }

  if (items.length === 0) return <></>

  return (
    <>
      <Box role='group' position='relative' width='min'>
        <Icon
          className='dots-icon'
          cursor='pointer'
          fontSize='lg'
          visibility={visibleOnlyOnHover ? 'hidden' : 'visible'}
        >
          <BsThreeDots />
        </Icon>

        <Box
          zIndex={100}
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
              onClick={() => setAction(action as WorkItemAction)}
            >
              {icon}
              {name}
            </Box>
          ))}
        </Box>
      </Box>

      {action && (
        <WorkItemActionModal
          sprintId={sprintId}
          action={action}
          workItem={workItem}
          onClose={handleClose}
          actionName={actionItem?.name || ''}
        />
      )}
    </>
  )
}

export default WorkItemActionMenu
