import { VStack } from '@chakra-ui/layout'
import { SprintDetail } from 'domainTypes'
import moment from 'moment'
import { BsCalendarWeek, BsCalendarX } from 'react-icons/bs'
import { GiStairsGoal } from 'react-icons/gi'
import InfoItem from './InfoItem'

interface SprintDetailTabProps {
  sprint: SprintDetail
}

const SprintDetailTab = ({ sprint }: SprintDetailTabProps) => {
  return (
    <VStack alignItems='flex-start' spacing={5} mt={5}>
      <InfoItem
        icon={<BsCalendarWeek />}
        name='Start'
        value={moment(sprint.startDate).format('DD MMM YYYY')}
      />

      <InfoItem
        icon={<BsCalendarX />}
        name='End'
        value={moment(sprint.endDate).format('DD MMM YYYY')}
      />

      <InfoItem icon={<GiStairsGoal />} name='Goal' value={sprint.goal || '--'} />
    </VStack>
  )
}

export default SprintDetailTab
