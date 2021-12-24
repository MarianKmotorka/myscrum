import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import { apiErrorToast } from 'services/toastService'
import { ApiError } from 'api/types'
import { DiscussionMessage } from 'domainTypes'
import { Avatar, Box, IconButton, Textarea } from '@chakra-ui/react'
import { useAuthorizedUser } from 'services/auth/AuthProvider'
import { getAvatarUrl } from 'utils'
import { IoMdSend } from 'react-icons/io'

interface NewMessageProps {
  workItemId: string
}

const NewMessage = ({ workItemId }: NewMessageProps) => {
  const { id: projectId } = useSelectedProject()
  const queryClient = useQueryClient()
  const [text, setText] = useState('')
  const { currentUser } = useAuthorizedUser()
  const [sending, setSending] = useState(false)

  const create = async () => {
    if (!text) return

    setSending(true)
    try {
      const { data } = await api.post<DiscussionMessage>(
        `/work-items/${workItemId}/discussion-messages`,
        { text, projectId }
      )

      queryClient.setQueryData<DiscussionMessage[]>(
        ['work-items', workItemId, 'discussion-messages'],
        prev => [data, ...(prev || [])]
      )

      setText('')
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
    setSending(false)
  }

  return (
    <Box d='flex' gridGap={3}>
      <Avatar src={getAvatarUrl(currentUser.id)} />

      <Textarea
        rows={5}
        border='solid 1px var(--chakra-colors-gray-200)'
        borderRadius='lg'
        value={text}
        onChange={e => setText(e.target.value)}
        _focus={{}}
        placeholder="What's on your mind?"
      />

      <IconButton
        aria-label='send'
        alignSelf='flex-end'
        width='50px'
        isLoading={sending}
        isDisabled={!text}
        onClick={create}
        icon={<IoMdSend />}
      />
    </Box>
  )
}

export default NewMessage
