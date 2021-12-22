import { ApiError } from 'api/types'
import { WorkItemDetail } from 'domainTypes'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import api from 'api/httpClient'
import { useSelectedProject } from 'services/ProjectsProvider'
import FetchError from 'components/elements/FetchError'
import { Avatar, Box, Button, HStack, Image, Spinner, Text } from '@chakra-ui/react'
import {
  workItemTypeToImageMap,
  workItemTypeToTextMap,
  workItemTypeToColorMap,
  getAvatarUrl
} from 'utils'
import Form from 'components/elements/HookForm/Form'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { ChevronLeftIcon } from '@chakra-ui/icons'

const WorkItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { id: projectId } = useSelectedProject()
  const { data, isLoading, error } = useQuery<WorkItemDetail, ApiError>(
    ['work-items', id],
    async () => (await api.get(`/work-items/${id}?projectId=${projectId}`)).data
  )

  const { onSubmit, submitting } = useSubmitForm({
    url: `/work-items/${id}`
  })

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  const { title, type, assignedTo } = data

  return (
    <Box mb={5}>
      <Button
        mt={5}
        mb={8}
        variant='link'
        color='gray.700'
        fontWeight='normal'
        onClick={() => navigate(-1)}
        leftIcon={<ChevronLeftIcon />}
      >
        Go back
      </Button>

      <Form onSubmit={onSubmit} defaultValues={{}}>
        <Box borderLeft={`solid 8px ${workItemTypeToColorMap[type]}`} pl={4} py={1}>
          <HStack>
            <Image
              width='15px'
              objectFit='contain'
              maxH='15px'
              src={workItemTypeToImageMap[type]}
            />
            <Text color='gray.500' fontSize='xs'>
              {workItemTypeToTextMap[type].toUpperCase()}
            </Text>
          </HStack>

          <Text noOfLines={1} fontWeight={500} fontSize='2xl' my={2}>
            {title}
          </Text>

          <HStack>
            <Avatar size='xs' src={assignedTo ? getAvatarUrl(assignedTo.id) : undefined} />

            <Text color={assignedTo ? 'black' : 'gray.500'} fontSize='0.95em'>
              {assignedTo?.fullName || 'Unassigned'}
            </Text>
          </HStack>
        </Box>

        <Box height={400}></Box>
      </Form>
    </Box>
  )
}

export default WorkItemDetailPage
