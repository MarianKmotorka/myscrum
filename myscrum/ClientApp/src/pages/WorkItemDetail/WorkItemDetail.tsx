import { ApiError } from 'api/types'
import { WorkItemDetail } from 'domainTypes'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import api from 'api/httpClient'
import { useSelectedProject } from 'services/ProjectsProvider'
import FetchError from 'components/elements/FetchError'
import { Box, Button, HStack, Image, Spinner, Text } from '@chakra-ui/react'
import { workItemTypeToImageMap, workItemTypeToTextMap, workItemTypeToColorMap } from 'utils'
import Form from 'components/elements/HookForm/Form'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import FormInput from 'components/elements/HookForm/FormInput'
import { errorToastIfNotValidationError } from 'services/toastService'
import AssignedTo from './AssignedTo'
import { WorkItemDetailFormValues } from './utils'

const WorkItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { id: projectId } = useSelectedProject()
  const { data, isLoading, error } = useQuery<WorkItemDetail, ApiError>(
    ['work-items', id],
    async () => (await api.get(`/work-items/${id}?projectId=${projectId}`)).data
  )

  const { onSubmit, submitting } = useSubmitForm({
    url: `/work-items/${id}`,
    method: 'put',
    errorCallback: errorToastIfNotValidationError
  })

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  const { title, type, assignedTo } = data
  const defaultValues: WorkItemDetailFormValues = {
    title,
    assignedToId: assignedTo?.id
  }

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

      <Form onSubmit={onSubmit} defaultValues={defaultValues}>
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

          <FormInput
            name='title'
            fontWeight={500}
            fontSize='2xl'
            mt={1}
            mb={2}
            border='none'
            pl={0}
          />

          <AssignedTo />
        </Box>

        <Box height={400}></Box>
      </Form>
    </Box>
  )
}

export default WorkItemDetailPage
