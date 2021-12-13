import {
  Button,
  Menu,
  MenuButton,
  MenuButtonProps,
  MenuItem,
  MenuList,
  PlacementWithLogical
} from '@chakra-ui/react'
import { WorkItemType } from 'domainTypes'

interface WorkItemMenuProps {
  menuButtonProps: MenuButtonProps & { children: JSX.Element | string }
  allowedTypes?: WorkItemType[]
  placement?: PlacementWithLogical
  onSelected(type: WorkItemType): void
}

const WorkItemMenu = ({
  menuButtonProps,
  allowedTypes,
  placement,
  onSelected
}: WorkItemMenuProps) => {
  const allTypes: Array<{ key: string; value: WorkItemType }> = Object.values(WorkItemType)
    .filter(x => typeof x === 'string')
    .map(x => ({ key: x as string, value: WorkItemType[x as any] as any }))

  const filtered = allowedTypes ? allTypes.filter(x => allowedTypes.includes(x.value)) : allTypes

  return (
    <Menu placement={placement}>
      <MenuButton as={Button} {...menuButtonProps} />

      <MenuList>
        {filtered.map(x => (
          <MenuItem key={x.key} onClick={() => onSelected(x.value)}>
            {x.key}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default WorkItemMenu
