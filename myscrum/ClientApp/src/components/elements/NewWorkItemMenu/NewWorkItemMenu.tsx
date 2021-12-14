import {
  Button,
  Input,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PlacementWithLogical
} from '@chakra-ui/react'
import { WorkItemType } from 'domainTypes'
import { useState } from 'react'

interface NewWorkItemMenuProps {
  menuButtonProps: MenuButtonProps & { children: JSX.Element | string }
  allowedTypes?: WorkItemType[]
  placement?: PlacementWithLogical
  onSelected(value: { type: WorkItemType; title: string }): void
}

const NewWorkItemMenu = ({
  menuButtonProps,
  allowedTypes,
  placement,
  onSelected
}: NewWorkItemMenuProps) => {
  const [selectedType, setSelectedType] = useState<WorkItemType>()
  const [title, setTitle] = useState('')

  const allTypes: Array<{ key: string; value: WorkItemType }> = Object.values(WorkItemType)
    .filter(x => typeof x === 'string')
    .map(x => ({ key: x as string, value: WorkItemType[x as any] as any }))

  const filtered = allowedTypes ? allTypes.filter(x => allowedTypes.includes(x.value)) : allTypes

  const handleClose = () => {
    setSelectedType(undefined)
    setTitle('')
  }

  const handleSubmit = () => {
    if (selectedType === undefined) return
    onSelected({ type: selectedType, title })
    handleClose()
  }

  return (
    <>
      <Menu placement={placement}>
        <MenuButton as={Button} {...menuButtonProps} />

        <MenuList>
          {filtered.map(x => (
            <MenuItem key={x.key} onClick={() => setSelectedType(x.value)}>
              {x.key}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {selectedType !== undefined && (
        <Modal isOpen onClose={handleClose}>
          <ModalOverlay />

          <ModalContent>
            <ModalHeader>Create {WorkItemType[selectedType]}</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <Input placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
            </ModalBody>

            <ModalFooter>
              <Button variant='ghost' onClick={handleClose}>
                Dismiss
              </Button>

              <Button variant='primary' type='submit' isDisabled={!title} onClick={handleSubmit}>
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default NewWorkItemMenu
