import { DeleteIcon } from '@chakra-ui/icons'
import { Avatar, HStack, IconButton, Text, Textarea, VStack } from '@chakra-ui/react'
import { ApiError } from 'api/types'
import { RetroComment } from 'domainTypes'
import { memo, useState } from 'react'
import { apiErrorToast, successToast } from 'services/toastService'
import { getAvatarUrl } from 'utils'
import api from 'api/httpClient'
import { useQueryClient } from 'react-query'

interface RetrospectiveItemProps {
  item: RetroComment
  isMyItem: boolean
}

const RetrospectiveItem = memo(({ item, isMyItem }: RetrospectiveItemProps) => {
  const [text, setText] = useState(item.text)
  const queryClient = useQueryClient()

  const edit = async () => {
    try {
      await api.put(`/sprints/${item.sprintId}/retrospective-comments/${item.id}`, { text })
      queryClient.setQueryData<RetroComment[]>(
        ['sprints', item.sprintId, 'retrospective-comments'],
        prev => prev!.map(x => (x.id === item.id ? { ...x, text } : x))
      )
      successToast('Saved')
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  return (
    <VStack alignItems='stretch' spacing={1}>
      <HStack alignItems='flex-end'>
        <Avatar size='sm' src={getAvatarUrl(item.author.id)} />

        <Text color='gray.500'>{item.author.fullName}</Text>

        {isMyItem && (
          <IconButton
            ml='auto !important'
            size='xs'
            colorScheme='red'
            variant='outline'
            aria-label='delete'
            icon={<DeleteIcon />}
          />
        )}
      </HStack>

      <Textarea
        isDisabled={!isMyItem}
        _disabled={{}}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={edit}
      />
    </VStack>
  )
})

export default RetrospectiveItem
