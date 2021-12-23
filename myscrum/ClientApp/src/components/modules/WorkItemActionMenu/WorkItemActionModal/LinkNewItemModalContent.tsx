import { Button, ModalBody, ModalFooter, VStack } from '@chakra-ui/react'
import Form from 'components/elements/HookForm/Form'
import FormInput from 'components/elements/HookForm/FormInput'
import FormSelect from 'components/elements/HookForm/FormSelect'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { WorkItemType } from 'domainTypes'
import { useQueryClient } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'
import { errorToastIfNotValidationError } from 'services/toastService'
import { allowedChildWorkItemsMap, workItemTypeToTextMap } from 'utils'
import { requiredValidator } from 'utils/validators'

interface LinkNewItemModalContentProps {
  workItem: { id: string; type: WorkItemType; title: string }
  sprintId: string | undefined
  onClose: () => void
}

interface FormValue {
  type: string // e.g. '0' or '5'
  title: string
}

const LinkNewItemModalContent = ({ workItem, sprintId, onClose }: LinkNewItemModalContentProps) => {
  const queryClient = useQueryClient()
  const { id: projectId } = useSelectedProject()
  const { onSubmit, submitting } = useSubmitForm<FormValue>({
    url: '/work-items',
    formatter: ({ title, type }) => ({
      title,
      type: +type,
      projectId,
      sprintId,
      parentId: workItem.id
    }),
    errorCallback: errorToastIfNotValidationError,
    successCallback: async () => {
      sprintId && queryClient.invalidateQueries(['work-items', { projectId }])
      onClose()
    }
  })

  return (
    <Form onSubmit={onSubmit} defaultValues={{ title: '', type: '' }}>
      <ModalBody>
        <VStack>
          <FormSelect name='type' label='Work Item Type' validate={requiredValidator} isRequired>
            <option value=''>Select work item type</option>

            {allowedChildWorkItemsMap[workItem.type].map(x => (
              <option key={x} value={x}>
                {workItemTypeToTextMap[x]}
              </option>
            ))}
          </FormSelect>

          <FormInput name='title' label='Title' validate={requiredValidator} isRequired />
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Button mr={2} variant='ghost' onClick={onClose}>
          Dismiss
        </Button>

        <Button type='submit' isLoading={submitting}>
          Save
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default LinkNewItemModalContent
