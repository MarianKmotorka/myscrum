import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Spinner } from '@chakra-ui/spinner'
import { SprintDetail } from 'domainTypes'
import { ApiError } from 'api/types'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import { Box } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import SprintDetailTab from './Tabs/SprintDetailTab/SprintDetail'
import EditableSprintName from './Tabs/SprintDetailTab/EditableSprintName'
import SprintBacklogTab from './Tabs/SprintBacklogTab/SprintBacklogTab'

const SprintDetailPage = () => {
  const { id } = useParams()
  const project = useSelectedProject()

  const { data, isLoading, error } = useQuery<SprintDetail, ApiError>(
    ['sprints', id, { projectId: project.id }],
    async () => (await api.get(`/sprints/${id}?projectId=${project.id}`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  return (
    <Box mb={5}>
      <Link to='/sprints'>
        <Button
          variant='link'
          color='gray.700'
          mt={3}
          fontWeight='normal'
          leftIcon={<ChevronLeftIcon />}
        >
          Back to sprints
        </Button>
      </Link>

      <EditableSprintName sprint={data} isEditable={project.amIOwner} />

      <Tabs
        isLazy
        mt={7}
        bg='white'
        p={3}
        boxShadow='0 0 3px rgba(20,0,50, 0.1)'
        borderRadius='md'
        css={css`
          [aria-selected='true'] {
            color: var(--chakra-colors-secondary) !important;
            font-weight: 500;
          }
        `}
      >
        <TabList>
          <Tab>Info</Tab>
          <Tab>Sprint backlog</Tab>
          <Tab>Capacity</Tab>
          <Tab>Statistics</Tab>
          <Tab>Retrospectives</Tab>
        </TabList>

        <TabPanels minHeight='calc(100vh - 300px)'>
          <TabPanel height='100%'>
            <SprintDetailTab sprint={data} />
          </TabPanel>

          <TabPanel height='100%'>
            <SprintBacklogTab sprint={data} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default SprintDetailPage
