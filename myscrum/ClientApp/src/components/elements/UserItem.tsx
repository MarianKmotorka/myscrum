import { Avatar } from '@chakra-ui/avatar'
import { Box, HStack, Text } from '@chakra-ui/layout'
import { User } from 'domainTypes'
import { getAvatarUrl } from 'utils'

interface UserItemProps {
  user: User
}

const UserItem = ({ user }: UserItemProps) => {
  return (
    <HStack my={1}>
      <Avatar width='40px' height='40px' src={getAvatarUrl(user.id)} />
      <Text>{user.fullName}</Text>
    </HStack>
  )
}

export default UserItem
