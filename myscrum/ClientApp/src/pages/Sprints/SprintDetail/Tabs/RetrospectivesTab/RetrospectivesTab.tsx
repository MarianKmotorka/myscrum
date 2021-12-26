import { HStack, Input, Text, Textarea, VStack } from '@chakra-ui/react'
import { ApiError } from 'api/types'
import { useState } from 'react'
import { apiErrorToast } from 'services/toastService'
import api from 'api/httpClient'
import { RetroComment } from 'domainTypes'
import { useQueryClient } from 'react-query'

interface RetrospectivesTabProps {
  sprintId: string
}

const RetrospectivesTab = ({ sprintId }: RetrospectivesTabProps) => {
  const [goodText, setGoodText] = useState('')
  const [badText, setBadText] = useState('')
  const queryClient = useQueryClient()

  const submit = async (e: React.KeyboardEvent<HTMLTextAreaElement>, isGood: boolean) => {
    if (e.key !== 'Enter' || e.shiftKey) return

    try {
      const { data } = await api.post<RetroComment>(`/sprints/${sprintId}/retrospective-comments`, {
        text: isGood ? goodText : badText,
        isPositive: isGood
      })
      queryClient.setQueryData<RetroComment[]>(
        ['sprints', sprintId, 'retrospective-comments'],
        prev => [data, ...(prev || [])]
      )
    } catch (err) {
      apiErrorToast(err as ApiError)
    }

    isGood ? setGoodText('') : setBadText('')
  }

  return (
    <HStack mt={5}>
      <VStack minH='350px' flex='1' borderRight='solid 1px var(--chakra-colors-gray-200)' pr={2}>
        <Text fontWeight={500} color='gray.600'>
          What was good 😊
        </Text>

        <Textarea
          placeholder='What was good'
          value={goodText}
          onChange={e => setGoodText(e.target.value)}
          onKeyPress={e => submit(e, true)}
        />
      </VStack>

      <VStack flex='1' minH='350px'>
        <Text fontWeight={500} color='gray.600'>
          What was not so good 😞
        </Text>

        <Textarea
          placeholder='What was bad'
          value={badText}
          onChange={e => setBadText(e.target.value)}
          onKeyPress={e => submit(e, false)}
        />
      </VStack>
    </HStack>
  )
}

export default RetrospectivesTab
