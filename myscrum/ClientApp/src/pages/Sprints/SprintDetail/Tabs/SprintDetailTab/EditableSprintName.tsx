import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable'
import { Box } from '@chakra-ui/layout'
import { SprintDetail } from 'domainTypes'
import api from 'api/httpClient'
import { apiErrorToast, successToast } from 'services/toastService'
import { ApiError } from 'api/types'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'

interface EditableSprintNameProps {
  sprint: SprintDetail
  isEditable: boolean
}

const EditableSprintName = ({ sprint, isEditable }: EditableSprintNameProps) => {
  const [editableKey, setEditableKey] = useState(false)
  const queryClient = useQueryClient()
  const project = useSelectedProject()

  const rename = async (newName: string) => {
    try {
      const resp = await api.patch<SprintDetail>(`/sprints/${sprint.id}`, {
        ...sprint,
        name: newName
      })
      successToast('Saved')
      queryClient.setQueryData(['sprints', sprint.id, { projectId: project.id }], resp.data)
    } catch (err) {
      apiErrorToast(err as ApiError)
      setEditableKey(prev => !prev)
    }
  }

  return (
    <Box
      fontSize='lg'
      boxShadow='xl'
      color='white'
      bg='primary'
      p={3}
      pl={5}
      borderRadius='100px'
      fontWeight='500'
      mt={5}
    >
      <Editable
        isDisabled={!isEditable}
        key={editableKey ? 0 : 1}
        defaultValue={sprint.name}
        onSubmit={rename}
      >
        <EditablePreview />
        <EditableInput />
      </Editable>
    </Box>
  )
}

export default EditableSprintName
