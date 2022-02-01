import { useQuery } from 'react-query'
import { SprintStatistics } from './types'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Spinner } from '@chakra-ui/react'
import { ApiError } from 'api/types'
import WorkByAssignedTo from './WorkByAssignedTo'
import BurndownChart from './BurndownChart'

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

  return (
    <>
      <WorkByAssignedTo capacities={data.capacities} />
      <BurndownChart burndown={data.burndown} />
    </>
  )
}

export default StatisticsTab
