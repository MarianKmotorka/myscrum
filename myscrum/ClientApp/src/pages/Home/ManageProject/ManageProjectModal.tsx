import { Button } from '@chakra-ui/button'
import { CheckIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/layout'
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
import api from 'api/httpClient'
import { useProjects } from 'services/ProjectsProvider'
import { errorToast, errorToastIfNotValidationError, successToast } from 'services/toastService'
import { ApiError } from 'api/types'
import Contributors from './Contributors'

interface ManageProjectModalProps {
  onClose: () => void
  project: Project
}

interface FormValue {
  name: string
}

const ManageProjectModal = ({ project, onClose }: ManageProjectModalProps) => {
  const { updateProject, setSelectedProject, removeProject, selectedProject } = useProjects()
  const { onSubmit, submitting } = useSubmitForm<FormValue, Project>({
    url: `/projects/${project.id}`,
    method: 'put',
    successCallback: project => {
      updateProject(project)
      successToast('Saved')
    },
    errorCallback: errorToastIfNotValidationError
  })

  const deleteProject = async () => {
    if (!window.confirm(`Do you really want to delete '${project.name}' ?`)) return

    try {
      await api.delete(`/projects/${project.id}`)
      successToast('Deleted')
      removeProject(project)
      onClose()
    } catch (err) {
      errorToast((err as ApiError).data.errorMessage)
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxW='2xl'>
        <ModalHeader>Manage Project</ModalHeader>
        <ModalCloseButton />

        <ModalBody pt={4}>
          <Form defaultValues={{ name: project.name }} onSubmit={onSubmit}>
            <FormInput isDisabled={!project.amIOwner} name='name' label='Name' />

            {project.amIOwner && (
              <Box d='flex' justifyContent='flex-end'>
                <Button mt={3} isLoading={submitting} type='submit'>
                  Rename
                </Button>
              </Box>
            )}
          </Form>
        </ModalBody>

        <ModalBody pt={4} pb={10}>
          <Contributors {...project} />
        </ModalBody>

        <ModalFooter pt={4} borderTop='solid 1px' borderColor='gray.200'>
          {project.amIOwner && (
            <Button colorScheme='red' variant='outline' onClick={deleteProject}>
              Delete
            </Button>
          )}

          {selectedProject?.id === project.id ? (
            <Text bg='gray.50' color='gray.400' px={3} ml={3} py={2} borderRadius='md'>
              <CheckIcon mr={2} />
              Selected
            </Text>
          ) : (
            <Button variant='primary' ml={3} onClick={() => setSelectedProject(project)}>
              Select for workspace
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ManageProjectModal
