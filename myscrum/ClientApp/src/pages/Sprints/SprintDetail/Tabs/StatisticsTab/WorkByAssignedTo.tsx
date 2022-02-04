import { Text, VStack } from '@chakra-ui/react'
import Progressbar from 'components/elements/Progressbar/Progressbar'
import UserItem from 'components/elements/UserItem'
import { SprintStatistics } from './types'

interface WorkByAssignedToProps {
  capacities: SprintStatistics['capacities']
}

const WorkByAssignedTo = ({ capacities }: WorkByAssignedToProps) => {
  const maxCapacityHours = Math.max(...capacities.map(x => x.capacityHours))
  const maxAssignedHours = Math.max(...capacities.map(x => x.assignedWorkHours))
  const maxHours = Math.max(maxCapacityHours, maxAssignedHours)

  return (
    <VStack alignItems='stretch' spacing={4} mt={5}>
      {capacities.map(x => {
        const isOverflow = x.assignedWorkHours > x.capacityHours
        const currSettingsMaxHours = Math.max(x.assignedWorkHours, x.capacityHours)
        const width = (currSettingsMaxHours * 100) / maxHours

        return (
          <VStack alignItems='stretch' spacing={0} key={x.user.id}>
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

export default WorkByAssignedTo
