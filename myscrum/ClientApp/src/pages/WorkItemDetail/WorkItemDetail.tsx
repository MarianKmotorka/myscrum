import { ApiError } from 'api/types'
import { WorkItemDetail, WorkItemType } from 'domainTypes'
import { useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import api from 'api/httpClient'
import { useSelectedProject } from 'services/ProjectsProvider'
import FetchError from 'components/elements/FetchError'
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Image,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text
} from '@chakra-ui/react'
import {
  workItemTypeToImageMap,
  workItemTypeToTextMap,
  workItemTypeToColorMap,
  formatDateForInput,
  getComputedRemainingHours
} from 'utils'
import Form from 'components/elements/HookForm/Form'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { ChevronLeftIcon, DeleteIcon } from '@chakra-ui/icons'
import FormInput from 'components/elements/HookForm/FormInput'
import { apiErrorToast, errorToastIfNotValidationError, successToast } from 'services/toastService'
import AssignedTo from './AssignedTo'
import { WorkItemDetailFormValues } from './utils'
import { BiSave } from 'react-icons/bi'
import StateAndSprint from './StateAndSprint'
import { requiredValidator } from 'utils/validators'
import DetailsTab from './Tabs/Details/DetailsTab'
import Discussion from './Tabs/Discussion/Discussion'
import { canSetRemainingHours } from './Tabs/Details/utils'

const WorkItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id: projectId } = useSelectedProject()
  const { data, isLoading, error, refetch } = useQuery<WorkItemDetail, ApiError>(
    ['work-items', id],
    async () => (await api.get(`/work-items/${id}?projectId=${projectId}`)).data
  )

  const { onSubmit, submitting } = useSubmitForm<WorkItemDetailFormValues, WorkItemDetail>({
    url: `/work-items/${id}`,
    method: 'put',
    formatter: x => ({
      ...x,
      remainingHours: canSetRemainingHours(type) ? x.remainingHours : null,
      parentId: data?.parent?.id,
      startDate: x.startDate || null,
      finishDate: x.finishDate || null,
      projectId
    }),
    errorCallback: errorToastIfNotValidationError,
    successCallback: (res, _, { formState: { dirtyFields } }) => {
      successToast('Saved')
      queryClient.setQueryData(['work-items', id], res)
      queryClient.invalidateQueries(['work-items', { projectId }])

      // update remaining hours for parentDetail.children
      if (dirtyFields.remainingHours && res.parent)
        if (queryClient.getQueryData(['work-items', res.parent.id]))
          queryClient.setQueryData<WorkItemDetail>(['work-items', res.parent.id], prev => ({
            ...prev!,
            children: prev!.children.map(x =>
              x.id === id ? { ...x, remainingHours: res.remainingHours } : x
            )
          }))
    }
  })

  const deleteWorkItem = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this work item?')) return

    try {
      await api.delete(`/work-items/${id}`, { params: { projectId } })
      queryClient.invalidateQueries(['work-items', { projectId }])
      navigate(-1)
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />

  const {
    title,
    type,
    state,
    sprint,
    startDate,
    finishDate,
    assignedTo,
    description,
    remainingHours,
    acceptationCriteria,
    implementationDetails,
    children
  } = data
  const defaultValues: WorkItemDetailFormValues = {
    title,
    state,
    remainingHours: canSetRemainingHours(type)
      ? remainingHours
      : getComputedRemainingHours(children),
    startDate: startDate ? formatDateForInput(startDate) : '',
    finishDate: finishDate ? formatDateForInput(finishDate) : '',
    sprintId: sprint?.id,
    assignedToId: assignedTo?.id,
    description: description || '',
    acceptationCriteria: acceptationCriteria || '',
    implementationDetails: implementationDetails || ''
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

      <Box border='solid 1px' borderColor='gray.200'>
        <Form onSubmit={onSubmit} defaultValues={defaultValues}>
          {({ formState: { isDirty } }) => (
            <>
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

                  <ButtonGroup
                    size='sm'
                    variant='secondary'
                    _hover={{}}
                    mr='4px !important'
                    ml='auto !important'
                  >
                    <Button
                      type='submit'
                      leftIcon={<BiSave />}
                      isDisabled={!isDirty}
                      isLoading={submitting}
                    >
                      Save
                    </Button>

                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label='delete'
                      colorScheme='red'
                      variant='outline'
                      onClick={deleteWorkItem}
                    />
                  </ButtonGroup>
                </HStack>

                <FormInput
                  name='title'
                  validate={requiredValidator}
                  fontWeight={500}
                  fontSize='2xl'
                  mb={2}
                  mt={-1}
                  border='none'
                  pl={0}
                />

                <AssignedTo />
              </Box>

              <StateAndSprint
                defaultState={state}
                sprintSelectDisabled={type === WorkItemType.Feature || type === WorkItemType.Epic}
              />

              <Tabs p={2} borderRadius='md' variant='soft-rounded' colorScheme='gray'>
                <TabList>
                  <Tab>Details</Tab>
                  {/* <Tab>History</Tab> */}
                  <Tab>Discussion</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <DetailsTab workItem={data} refetch={refetch} />
                  </TabPanel>

                  {/* <TabPanel>HISTORY</TabPanel> */}

                  <TabPanel>
                    <Discussion workItemId={data.id} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </Form>
      </Box>
    </Box>
  )
}

export default WorkItemDetailPage
