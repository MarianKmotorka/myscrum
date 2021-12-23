import { Avatar, HStack, Popover, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react'
import { Controller } from 'react-hook-form'
import { useSelectedProject } from 'services/ProjectsProvider'
import { getAvatarUrl } from 'utils'

const AssignedTo = () => {
  const { contributors, owner } = useSelectedProject()
  const projectUsers = [...contributors, owner]

  return (
    <Controller
      name='assignedToId'
      render={({ onChange, value, ...rest }) => {
        const assignedToId: string | undefined = value
        const assignedUser = projectUsers.find(x => x.id === assignedToId)

        return (
          <Popover placement='bottom-start' {...rest}>
            <PopoverTrigger>
              <HStack width='fit-content' cursor='pointer'>
                <Avatar size='xs' src={assignedToId ? getAvatarUrl(assignedToId) : undefined} />

                <Text color={assignedToId ? 'black' : 'gray.500'} fontSize='0.95em'>
                  {assignedUser?.fullName || 'Unassigned'}
                </Text>
              </HStack>
            </PopoverTrigger>

            <PopoverContent
              outline='none'
              overflow='hidden'
              border='solid 1px'
              borderColor='gray.200'
              _focus={{ boxShadow: 'lg' }}
            >
              {[{ id: undefined, fullName: 'Unassigned' }, ...projectUsers].map(x => (
                <HStack
                  key={x.id}
                  p={3}
                  cursor='pointer'
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => onChange(x.id)}
                >
                  <Avatar size='xs' src={x.id ? getAvatarUrl(x.id) : undefined} />

                  <Text>{x.fullName}</Text>
                </HStack>
              ))}
            </PopoverContent>
          </Popover>
        )
      }}
    />
  )
}

export default AssignedTo
