import { Avatar } from '@chakra-ui/avatar'
import { HStack, Text } from '@chakra-ui/layout'
import { ChakraProps } from '@chakra-ui/react'
import { User } from 'domainTypes'
import { getAvatarUrl } from 'utils'

interface UserItemProps extends ChakraProps {
  user: User
}

const UserItem = ({ user, ...rest }: UserItemProps) => {
  return (
    <HStack my={1} {...rest}>
      <Avatar width='40px' height='40px' src={getAvatarUrl(user.id)} />
      <Text>{user.fullName}</Text>
    </HStack>
  )
}

export default UserItem
