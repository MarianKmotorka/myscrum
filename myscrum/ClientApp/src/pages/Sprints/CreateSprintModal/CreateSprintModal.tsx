import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { ModalBody, ModalFooter, Button, VStack } from '@chakra-ui/react'
import Form from 'components/elements/HookForm/Form'
import FormInput from 'components/elements/HookForm/FormInput'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { Sprint } from 'domainTypes'
import { useProjects } from 'services/ProjectsProvider'
import { errorToastIfNotValidationError, successToast } from 'services/toastService'
import { requiredValidator } from 'utils/validators'
import SprintNameInput from './SprintNameInput'
import { useQueryClient } from 'react-query'

interface CreateSprintModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormValue {
  startDate: string
  endDate: string
  name: string
  goal: string
}

const defaultValues: FormValue = {
  startDate: '',
  endDate: '',
  name: '',
  goal: ''
}

const CreateSprintModal = ({ isOpen, onClose }: CreateSprintModalProps) => {
  const { selectedProject } = useProjects()
  const queryClient = useQueryClient()
  const { submitting, onSubmit } = useSubmitForm<FormValue, Sprint>({
    url: '/sprints',
    formatter: values => ({ ...values, projectId: selectedProject?.id }),
    successCallback: sprint => {
      successToast('Sprint created.')
      queryClient.setQueryData<Sprint[]>(['sprints', { projectId: selectedProject?.id }], prev => [
        sprint,
        ...(prev || [])
      ])
      onClose()
    },
    errorCallback: errorToastIfNotValidationError
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='xl'>
      <ModalOverlay />

      <Form onSubmit={onSubmit} defaultValues={defaultValues}>
        <ModalContent>
          <ModalHeader>Create sprint</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={3}>
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

              <SprintNameInput />

              <FormInput name='goal' label='Goal' />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onClose}>
              Dismiss
            </Button>

            <Button variant='primary' type='submit' isLoading={submitting}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  )
}

export default CreateSprintModal
