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
    if (newName === sprint.name) return

    try {
      const resp = await api.patch<SprintDetail>(`/sprints/${sprint.id}`, {
        ...sprint,
        name: newName
      })
      successToast('Saved')
      queryClient.setQueryData(['sprints', sprint.id, { projectId: project.id }], resp.data)
      queryClient.invalidateQueries(['sprints', { projectId: project.id }])
    } catch (err) {
      apiErrorToast(err as ApiError)
      setEditableKey(prev => !prev)
    }
  }

  return (
    <Box filter='drop-shadow(0 0 3px rgba(20,0,50, 0.1))'>
      <Box
        p={3}
        mt={5}
        pl={5}
        bg='white'
        fontSize='lg'
        color='primary'
        fontWeight='500'
        borderRadius='5px'
        borderColor='primary'
        borderLeft='solid 5px'
        clipPath='polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)'
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
    </Box>
  )
}

export default EditableSprintName
