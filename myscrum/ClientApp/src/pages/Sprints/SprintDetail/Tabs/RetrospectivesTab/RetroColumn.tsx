import { Text, Textarea, VStack } from '@chakra-ui/react'
import { RetroComment } from 'domainTypes'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useAuthorizedUser } from 'services/auth/AuthProvider'
import RetrospectiveItem from './RetrospectiveItem'
import api from 'api/httpClient'
import { ApiError } from 'api/types'
import { apiErrorToast } from 'services/toastService'

interface RetroColumnProps {
  items: RetroComment[]
  isGood: boolean
  sprintId: string
}

const RetroColumn = ({ items, isGood, sprintId }: RetroColumnProps) => {
  const { currentUser } = useAuthorizedUser()
  const queryClient = useQueryClient()
  const [text, setText] = useState('')

  const submit = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey || !text.trim()) return
    setText('')

    const prevData = queryClient.getQueryData<RetroComment[]>([
      'sprints',
      sprintId,
      'retrospective-comments'
    ])

    const tempId = Date.now().toString()

    try {
      queryClient.setQueryData<RetroComment[]>(
        ['sprints', sprintId, 'retrospective-comments'],
        prev => [
          {
            id: tempId,
            sprintId,
            text,
            isPositive: isGood,
            author: {
              id: currentUser.id,
              fullName: `${currentUser.givenName} ${currentUser.surname}`
            }
          },
          ...(prev || [])
        ]
      )

      const { data } = await api.post<RetroComment>(`/sprints/${sprintId}/retrospective-comments`, {
        text,
        isPositive: isGood
      })

      queryClient.setQueryData<RetroComment[]>(
        ['sprints', sprintId, 'retrospective-comments'],
        prev => prev!.map(x => (x.id === tempId ? data : x))
      )
    } catch (err) {
      apiErrorToast(err as ApiError)
      queryClient.setQueryData<RetroComment[]>(
        ['sprints', sprintId, 'retrospective-comments'],
        prevData || []
      )
    }
  }

  return (
    <VStack
      minW='300px'
      flex='1'
      pr={2}
      spacing={6}
      alignItems='stretch'
      borderRight='solid 1px var(--chakra-colors-gray-200)'
    >
      <Text fontWeight={500} color='gray.600' alignSelf='center'>
        {isGood ? 'What was good 😊' : ' What was not so good 😞'}
      </Text>

      <Textarea
        placeholder={isGood ? 'What was good' : 'What was bad'}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyUp={submit}
      />

      <VStack alignItems='stretch' spacing={6}>
        {items.map(x => (
          <RetrospectiveItem key={x.id} item={x} isMyItem={currentUser.id === x.author.id} />
        ))}
      </VStack>
    </VStack>
  )
}

export default RetroColumn
