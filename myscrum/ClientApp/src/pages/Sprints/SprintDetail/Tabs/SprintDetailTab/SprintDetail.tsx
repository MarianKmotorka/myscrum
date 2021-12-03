import { Button, ButtonGroup } from '@chakra-ui/button'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { VStack } from '@chakra-ui/layout'
import { SprintDetail } from 'domainTypes'
import moment from 'moment'
import { BsCalendarWeek, BsCalendarX } from 'react-icons/bs'
import { GiStairsGoal } from 'react-icons/gi'
import { useSelectedProject } from 'services/ProjectsProvider'
import InfoItem from './InfoItem'
import { useState } from 'react'
import Form from 'components/elements/HookForm/Form'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { apiErrorToast, errorToastIfNotValidationError, successToast } from 'services/toastService'
import { useQueryClient } from 'react-query'
import FormInput from 'components/elements/HookForm/FormInput'
import { requiredValidator } from 'utils/validators'
import { ApiError } from 'api/types'
import api from 'api/httpClient'
import { useNavigate } from 'react-router'

interface SprintDetailTabProps {
  sprint: SprintDetail
}

interface FormValue {
  startDate: string
  endDate: string
  goal: string
}

const SprintDetailTab = ({ sprint }: SprintDetailTabProps) => {
  const project = useSelectedProject()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  const { onSubmit, submitting } = useSubmitForm<FormValue, SprintDetail>({
    url: `/sprints/${sprint.id}`,
    method: 'patch',
    formatter: values => ({ ...values, name: sprint.name }),
    successCallback: res => {
      successToast('Saved')
      queryClient.setQueryData(['sprints', sprint.id, { projectId: project.id }], res)
      setIsEditing(false)
    },
    errorCallback: errorToastIfNotValidationError
  })

  const deleteSprint = async () => {
    if (!window.confirm(`Do you really want to delete ${sprint.name} ?`)) return

    try {
      await api.delete(`/sprints/${sprint.id}`)
      successToast('Sprint deleted.')
      navigate('/sprints')
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  const formatDateForInput = (date: string) => moment(date).format('YYYY-MM-DD')

  const defaultValue: FormValue = {
    goal: sprint.goal,
    startDate: formatDateForInput(sprint.startDate),
    endDate: formatDateForInput(sprint.endDate)
  }

  return (
    <Form defaultValues={defaultValue} onSubmit={onSubmit}>
      <VStack alignItems='flex-start' spacing={5} pt={project.amIOwner ? 0 : 5}>
        {project.amIOwner && (
          <ButtonGroup ml='auto' mb='-15px'>
            {!isEditing && (
              <>
                <Button leftIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button leftIcon={<DeleteIcon />} colorScheme='red' onClick={deleteSprint}>
                  Delete
                </Button>
              </>
            )}

            {isEditing && (
              <>
                <Button variant='ghost' onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button isLoading={submitting} variant='secondary' type='submit'>
                  Save
                </Button>
              </>
            )}
          </ButtonGroup>
        )}

        {!isEditing && (
          <>
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
          </>
        )}

        <VStack display={isEditing ? undefined : 'none'} spacing={4} width='100%'>
          <FormInput
            isRequired
            label='Start date'
            name='startDate'
            type='date'
            validate={requiredValidator}
          />

          <FormInput
            isRequired
            label='End date'
            name='endDate'
            type='date'
            validate={requiredValidator}
          />

          <FormInput name='goal' label='Goal' />
        </VStack>
      </VStack>
    </Form>
  )
}

export default SprintDetailTab
