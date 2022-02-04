import { useQuery } from 'react-query'
import { SprintStatistics } from './types'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react'
import { ApiError } from 'api/types'
import WorkByAssignedTo from './WorkByAssignedTo'
import BurndownChart from './BurndownChart'
import { css } from '@emotion/react'

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
    <Tabs
      mt={3}
      variant='soft-rounded'
      colorScheme='gray'
      css={css`
        [aria-selected='true'] {
          color: var(--chakra-colors-secondary) !important;
          font-weight: 500;
        }
        .chakra-tabs__tab {
          transform: scale(0.9);
        }
      `}
    >
      <TabList overflowX='auto'>
        <Tab>Assigned work</Tab>
        <Tab>Burndown</Tab>
      </TabList>

      <TabPanels>
        <TabPanel p={0}>
          <WorkByAssignedTo capacities={data.capacities} />
        </TabPanel>

        <TabPanel p={0}>
          <BurndownChart burndown={data.burndownData} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default StatisticsTab
