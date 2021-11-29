import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Spinner } from '@chakra-ui/spinner'
import { SprintDetail } from 'domainTypes'
import { ApiError } from 'api/types'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import { Box, Text } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import { css } from '@emotion/react'
import SprintDetailTab from './Tabs/SprintDetailTab/SprintDetail'
import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable'
import EditableSprintName from './Tabs/SprintDetailTab/EditableSprintName'

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
    <Box>
      <Link to='/sprints'>
        <Button variant='link' mt={3} fontWeight='normal' leftIcon={<ChevronLeftIcon />}>
          Sprints
        </Button>
      </Link>

      <EditableSprintName sprint={data} isEditable={project.amIOwner} />

      <Tabs
        variant='enclosed'
        mt={7}
        css={css`
          [aria-selected='true'] {
            color: var(--chakra-colors-primary) !important;
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

        <TabPanels>
          <TabPanel>
            <SprintDetailTab sprint={data} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default SprintDetailPage
