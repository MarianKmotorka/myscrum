import { IconButton, Text } from '@chakra-ui/react'
import { ApiError } from 'api/types'
import { DiscussionMessage } from 'domainTypes'
import { AiOutlineLike } from 'react-icons/ai'
import { apiErrorToast } from 'services/toastService'
import api from 'api/httpClient'
import { useQueryClient } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'

interface LikeButtonProps {
  message: DiscussionMessage
}

const LikeButton = ({ message }: LikeButtonProps) => {
  const queryClient = useQueryClient()
  const { id: projectId } = useSelectedProject()

  const like = async () => {
    try {
      await api.post(
        `/work-items/${message.workItemId}/discussion-messages/${message.id}/toggle-like?projectId=${projectId}`
      )
      const isLikedByMe = !message.isLikedByMe
      const likeCount = isLikedByMe ? message.likeCount + 1 : message.likeCount - 1
      queryClient.setQueryData<DiscussionMessage[]>(
        ['work-items', message.workItemId, 'discussion-messages'],
        prev =>
          prev ? prev.map(x => (x.id === message.id ? { ...x, likeCount, isLikedByMe } : x)) : []
      )
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  return (
    <IconButton
      onClick={like}
      variant={message.isLikedByMe ? 'primaryOutline' : 'outline'}
      icon={
        <>
          <AiOutlineLike />
          {!!message.likeCount && <Text ml={1}>{message.likeCount}</Text>}
        </>
      }
      aria-label='like'
    />
  )
}

export default LikeButton
