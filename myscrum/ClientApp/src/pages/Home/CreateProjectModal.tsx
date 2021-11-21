import { Button } from '@chakra-ui/button'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal'
import Form from 'components/elements/HookForm/Form'
import FormInput from 'components/elements/HookForm/FormInput'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { Project } from 'domainTypes'
import { useProjects } from 'services/ProjectsProvider'

interface CreateProjectModalProps {
  onClose: () => void
  isOpen: boolean
}

interface FormValue {
  name: string
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const { addProject } = useProjects()
  const { onSubmit, submitting } = useSubmitForm<FormValue, Project>({
    url: '/projects',
    successCallback: newProject => {
      addProject(newProject)
      onClose()
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <Form defaultValues={{ name: '' }} onSubmit={onSubmit}>
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>

          <ModalCloseButton />

          <ModalBody>
            <FormInput name='name' label='Name' />
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onClose}>
              Discard
            </Button>

            <Button variant='primary' ml={3} isLoading={submitting} type='submit'>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  )
}

export default CreateProjectModal
