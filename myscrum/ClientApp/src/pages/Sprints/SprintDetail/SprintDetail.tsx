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

      <Text
        fontSize='lg'
        color='linkedin.700'
        bg='linear-gradient(to right, #E2F4FD 0%,#ffffff 40%)'
        p={3}
        pl={5}
        borderRadius='100px'
        fontWeight='500'
        mt={5}
      >
        {data.name}
      </Text>

      <Tabs colorScheme='linkedin' variant='enclosed' mt={6} isLazy>
        <TabList>
          <Tab>Info</Tab>
          <Tab>Sprint backlog</Tab>
          <Tab>Capacity</Tab>
          <Tab>Statistics</Tab>
          <Tab>Retrospectives</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default SprintDetailPage
