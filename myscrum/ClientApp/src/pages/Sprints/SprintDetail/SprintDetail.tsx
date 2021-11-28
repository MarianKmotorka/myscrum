import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import { Spinner } from '@chakra-ui/spinner'
import { SprintDetail } from 'domainTypes'
import { ApiError } from 'api/types'

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
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default SprintDetailPage
