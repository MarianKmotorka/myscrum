import { useQuery } from 'react-query'
import { SprintStatistics } from './types'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Spinner, Text, VStack } from '@chakra-ui/react'
import { ApiError } from 'api/types'
import Progressbar from 'components/elements/Progressbar/Progressbar'
import UserItem from 'components/elements/UserItem'

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

  const maxCapacityHours = Math.max(...data.capacities.map(x => x.capacityHours))
  const maxAssignedHours = Math.max(...data.capacities.map(x => x.assignedWorkHours))
  const maxHours = Math.max(maxCapacityHours, maxAssignedHours)

  return (
    <VStack alignItems='stretch' spacing={4}>
      <Text mb={3} color='secondary'>
        Work by <b>Assigned to</b>
      </Text>

      {data.capacities.map(x => {
        const isOverflow = x.assignedWorkHours > x.capacityHours
        const currSettingsMaxHours = Math.max(x.assignedWorkHours, x.capacityHours)
        const width = (currSettingsMaxHours * 100) / maxHours

        return (
          <VStack alignItems='stretch' spacing={0}>
            <UserItem user={x.user} mr='auto' />

            <Progressbar value={x.assignedWorkHours} max={x.capacityHours} width={`${width}%`} />

            <Text color='gray.500' fontSize='md'>
              <Text as='span' color={isOverflow ? 'red.500' : undefined}>
                {x.assignedWorkHours}
              </Text>{' '}
              of <Text as='b'>{x.capacityHours}</Text> hours
            </Text>
          </VStack>
        )
      })}
    </VStack>
  )
}

export default StatisticsTab
