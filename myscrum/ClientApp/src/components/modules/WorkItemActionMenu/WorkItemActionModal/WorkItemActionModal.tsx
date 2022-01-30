import {
  Box,
  HStack,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react'
import LinkExistingItemModalContent from 'components/modules/WorkItemActionMenu/WorkItemActionModal/LinkExistingItemModalContent'
import LinkNewItemModalContent from 'components/modules/WorkItemActionMenu/WorkItemActionModal/LinkNewItemModalContent'
import MoveToSprintModalContent from 'components/modules/WorkItemActionMenu/WorkItemActionModal/MoveToSprintModalContent'
import { workItemTypeToColorMap, workItemTypeToImageMap } from 'utils'
import { WorkItemActionMenuProps } from '../WorkItemActionMenu'

interface WorkItemActionModalProps {
  workItem: WorkItemActionMenuProps['workItem']
  actionName: string
  action: WorkItemAction
  sprintId: string | undefined
  onClose: () => void
  linkToExistingItemOptions?: { moveToParentsSprint?: boolean }
}

export type WorkItemAction = 'linkNew' | 'linkExisting' | 'move'

const WorkItemActionModal = ({
  workItem,
  actionName,
  action,
  sprintId,
  linkToExistingItemOptions,
  onClose
}: WorkItemActionModalProps) => {
  return (
    <Modal isOpen onClose={onClose} size='lg'>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>
          <Box borderLeft={`solid 5px ${workItemTypeToColorMap[workItem.type]}`} pl={2}>
            <Text>{actionName}</Text>

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
          <LinkNewItemModalContent workItem={workItem} sprintId={sprintId} onClose={onClose} />
        )}

        {action === 'linkExisting' && (
          <LinkExistingItemModalContent
            workItem={workItem}
            onClose={onClose}
            moveToParentsSprint={linkToExistingItemOptions?.moveToParentsSprint}
          />
        )}

        {action === 'move' && <MoveToSprintModalContent workItem={workItem} onClose={onClose} />}
      </ModalContent>
    </Modal>
  )
}

export default WorkItemActionModal
