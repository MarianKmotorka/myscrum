import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  Image,
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
import { KeyboardEvent, useState } from 'react'
import { ButtonStyles } from 'styles/components/ButtonStyles'
import { workItemTypeToColorMap, workItemTypeToImageMap, workItemTypeToTextMap } from 'utils'

interface NewWorkItemMenuProps {
  menuButtonProps?: MenuButtonProps & { children: JSX.Element | string }
  allowedTypes?: WorkItemType[]
  placement?: PlacementWithLogical
  onSelected(value: { type: WorkItemType; title: string }): void
}

const defaultMenuButtonChildren = (
  <>
    NEW ITEM
    <ChevronDownIcon ml={2} />
  </>
)

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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    handleSubmit()
  }

  return (
    <>
      <Menu placement={placement}>
        <MenuButton
          as={Button}
          {...ButtonStyles.variants.primary}
          {...menuButtonProps}
          children={menuButtonProps?.children || defaultMenuButtonChildren}
        />

        <MenuList>
          {filtered.map(x => (
            <MenuItem key={x.key} onClick={() => setSelectedType(x.value)}>
              {workItemTypeToTextMap[x.value]}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      {selectedType !== undefined && (
        <Modal isOpen onClose={handleClose}>
          <ModalOverlay />

          <ModalContent borderLeft={`solid 5px ${workItemTypeToColorMap[selectedType]}`}>
            <ModalHeader display='flex' alignItems='center'>
              <Image
                width='15px'
                objectFit='contain'
                maxH='15px'
                src={workItemTypeToImageMap[selectedType]}
                mr={2}
              />
              Create {workItemTypeToTextMap[selectedType]}
            </ModalHeader>

            <ModalCloseButton />

            <ModalBody>
              <Input
                placeholder='Title'
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant='ghost' onClick={handleClose}>
                Dismiss
              </Button>

              <Button
                variant='primary'
                bg={workItemTypeToColorMap[selectedType]}
                _hover={{ bg: workItemTypeToColorMap[selectedType] }}
                type='submit'
                isDisabled={!title}
                onClick={handleSubmit}
              >
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
