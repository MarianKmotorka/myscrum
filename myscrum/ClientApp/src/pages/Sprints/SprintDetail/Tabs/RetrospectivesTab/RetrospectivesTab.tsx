import { HStack, Spinner } from '@chakra-ui/react'
import { ApiError } from 'api/types'
import api from 'api/httpClient'
import { RetroComment } from 'domainTypes'
import { useQuery } from 'react-query'
import FetchError from 'components/elements/FetchError'
import RetroColumn from './RetroColumn'

interface RetrospectivesTabProps {
  sprintId: string
}

const RetrospectivesTab = ({ sprintId }: RetrospectivesTabProps) => {
  const { data, isLoading, error } = useQuery<RetroComment[], ApiError>(
    ['sprints', sprintId, 'retrospective-comments'],
    async () => (await api.get(`/sprints/${sprintId}/retrospective-comments`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return (
    <HStack mt={5} alignItems='stretch' flexWrap='wrap'>
      <RetroColumn items={data.filter(x => x.isPositive)} isGood sprintId={sprintId} />
      <RetroColumn items={data.filter(x => !x.isPositive)} isGood={false} sprintId={sprintId} />
    </HStack>
  )
}

export default RetrospectivesTab
