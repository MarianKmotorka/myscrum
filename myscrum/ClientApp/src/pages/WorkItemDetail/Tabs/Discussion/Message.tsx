import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, HStack, IconButton, Text, Textarea } from '@chakra-ui/react'
import { DiscussionMessage } from 'domainTypes'
import { useAuthorizedUser } from 'services/auth/AuthProvider'
import { getAvatarUrl, toLocalTime } from 'utils'
import LikeButton from './LikeButton'
import api from 'api/httpClient'
import { apiErrorToast } from 'services/toastService'
import { ApiError } from 'api/types'
import { useQueryClient } from 'react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface MessageProps {
  message: DiscussionMessage
}

const Message = ({ message }: MessageProps) => {
  const { currentUser } = useAuthorizedUser()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(message.text)
  const isMyMessage = message.author.id === currentUser.id

  const handleDelete = async () => {
    if (!window.confirm('Do you really want to delete this message?')) return

    try {
      await api.delete(`/work-items/${message.workItemId}/discussion-messages/${message.id}`)
      queryClient.setQueryData<DiscussionMessage[]>(
        ['work-items', message.workItemId, 'discussion-messages'],
        prev => (prev ? prev.filter(x => x.id !== message.id) : [])
      )
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  const handleEdit = async () => {
    try {
      await api.put(`/work-items/${message.workItemId}/discussion-messages/${message.id}`, { text })
      queryClient.setQueryData<DiscussionMessage[]>(
        ['work-items', message.workItemId, 'discussion-messages'],
        prev =>
          prev ? prev.map(x => (x.id === message.id ? { ...x, isEdited: true, text } : x)) : []
      )
      setIsEditing(false)
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  return (
    <motion.div
      layout
      initial={{ y: -170, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ x: 500, opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
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

            {message.isEdited && <EditIcon color='gray.500' mb='3px !important' />}
          </HStack>

          <Textarea
            rows={2}
            border='none'
            width='100%'
            value={text}
            onChange={e => setText(e.target.value)}
            isDisabled={!isEditing}
            _disabled={{}}
            _focus={{}}
            placeholder="What's on your mind?"
          />

          <HStack p='15px' pt={0} pb={2}>
            {!isEditing && (
              <>
                <LikeButton message={message} />

                {isMyMessage && (
                  <>
                    <IconButton
                      variant='outline'
                      aria-label='edit-message'
                      icon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                    />

                    <IconButton
                      variant='ghost'
                      colorScheme='red'
                      aria-label='delete-message'
                      icon={<DeleteIcon />}
                      onClick={handleDelete}
                    />
                  </>
                )}
              </>
            )}

            {isEditing && (
              <>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false)
                    setText(message.text)
                  }}
                >
                  Cancel
                </Button>

                <Button variant='secondary' onClick={handleEdit}>
                  Save
                </Button>
              </>
            )}
          </HStack>
        </Box>
      </Box>
    </motion.div>
  )
}

export default Message
