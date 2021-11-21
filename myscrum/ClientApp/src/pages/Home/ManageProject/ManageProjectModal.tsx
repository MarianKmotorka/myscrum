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
import { useProjects } from 'services/ProjectsProvider'
import { modalBodyProps } from './utils'

interface ManageProjectModalProps {
  onClose: () => void
  project: Project
}

interface FormValue {
  name: string
}

const ManageProjectModal = ({ project, onClose }: ManageProjectModalProps) => {
  const { updateProject, setSelectedProject, selectedProject } = useProjects()
  const { onSubmit, submitting } = useSubmitForm<FormValue, Project>({
    url: `/projects/${project.id}`,
    method: 'put',
    successCallback: project => {
      updateProject(project)
    }
  })

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />

      <ModalContent maxW='2xl'>
        <ModalHeader>Manage project</ModalHeader>
        <ModalCloseButton />

        <ModalBody {...modalBodyProps}>
          <Form defaultValues={{ name: project.name }} onSubmit={onSubmit}>
            <FormInput name='name' label='Name' />
            <Box d='flex' justifyContent='flex-end'>
              <Button mt={3} mb={4} isLoading={submitting} type='submit'>
                Rename
              </Button>
            </Box>
          </Form>
        </ModalBody>

        <ModalBody {...modalBodyProps}>Add people</ModalBody>

        <ModalFooter {...modalBodyProps}>
          <Button colorScheme='red' variant='outline'>
            Delete
          </Button>

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
