import { useQuery } from 'react-query'
import { SprintStatistics } from './types'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Spinner } from '@chakra-ui/react'
import { ApiError } from 'api/types'

interface StatisticsTabProps {
  sprintId: string
}

const StatisticsTab = ({ sprintId }: StatisticsTabProps) => {
  const { data, error, isLoading } = useQuery<SprintStatistics, ApiError>(
    ['sprints', sprintId, 'statistics'],
    async () => (await api.get(`/sprints/${sprintId}/statistics`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return <div>StatisticsTab works</div>
}

export default StatisticsTab