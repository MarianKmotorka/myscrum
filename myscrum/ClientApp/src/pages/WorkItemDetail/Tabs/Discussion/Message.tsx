import { Avatar, Box, HStack, Text, Textarea } from '@chakra-ui/react'
import { DiscussionMessage } from 'domainTypes'
import { useAuthorizedUser } from 'services/auth/AuthProvider'
import { getAvatarUrl, toLocalTime } from 'utils'
import LikeButton from './LikeButton'

interface MessageProps {
  message: DiscussionMessage
}

const Message = ({ message }: MessageProps) => {
  const { currentUser } = useAuthorizedUser()
  const isMyMessage = message.author.id === currentUser.id

  return (
    <Box d='flex' gridGap={3}>
      <Avatar src={getAvatarUrl(message.author.id)} />

      <Box width='100%' border='solid 1px var(--chakra-colors-gray-200)' borderRadius='lg'>
        <HStack p='15px' pb={0} alignItems='flex-end'>
          <Text fontWeight={500} color='gray.600'>
            {message.author.fullName}
          </Text>

          <Text color='gray.500' fontSize='sm' fontWeight={300}>
            commented {toLocalTime(message.createdAt, 'MMM DD')}
          </Text>
        </HStack>

        <Textarea
          rows={2}
          border='none'
          width='100%'
          value={message.text}
          _focus={{}}
          placeholder="What's on your mind?"
        />

        <HStack p='15px' pt={0} pb={2}>
          <LikeButton message={message} />
        </HStack>
      </Box>
    </Box>
  )
}

export default Message
