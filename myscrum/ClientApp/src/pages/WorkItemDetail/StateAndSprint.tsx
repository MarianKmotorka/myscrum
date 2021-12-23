import { Box, HStack, Spinner, Text } from '@chakra-ui/react'
import FetchError from 'components/elements/FetchError'
import FormSelect from 'components/elements/HookForm/FormSelect'
import { Sprint, WorkItemState } from 'domainTypes'
import { useFormContext } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'
import { workItemStateToTextColorMap } from 'utils'
import { WorkItemDetailFormValues } from './utils'
import api from 'api/httpClient'
import { ApiError } from 'api/types'

interface Props {
  defaultState: WorkItemState
}

const StateAndSprint = ({ defaultState }: Props) => {
  const { id: projectId } = useSelectedProject()
  const { watch } = useFormContext<WorkItemDetailFormValues>()
  const state = watch('state', defaultState)

  const {
    data: sprints,
    isLoading,
    error
  } = useQuery<Sprint[], ApiError>(
    ['sprints', { projectId }],
    async () => (await api.get(`/sprints?projectId=${projectId}`)).data
  )

  if (error) return <FetchError error={error} />

  return (
    <Box bg='bg2' borderY='solid 1px' borderColor='gray.200' height={100} py={3} pl={6}>
      <HStack maxW={400}>
        <Text color='gray.500' width={50}>
          State
        </Text>

        <Box>
          <Box
            width='10px'
            height='10px'
            borderRadius='50%'
            bg={workItemStateToTextColorMap[state].color}
          />
        </Box>

        <FormSelect name='state' onChangeFormatter={x => +x} size='sm'>
          {Object.entries(workItemStateToTextColorMap)
            .filter(([key]) => !isNaN(Number.parseInt(key)))
            .map(([key, value]) => (
              <option key={key} value={key}>
                {value.text}
              </option>
            ))}
        </FormSelect>
      </HStack>

      <HStack maxW={400}>
        <Text color='gray.500' width={50} mr='18px'>
          Sprint
        </Text>

        {isLoading && <Spinner size='sm' />}

        <FormSelect
          name='sprintId'
          size='sm'
          visibility={sprints ? 'visible' : 'hidden'}
          onChangeFormatter={x => x || undefined}
        >
          <option value=''>Backlog</option>

          {sprints?.map(x => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </FormSelect>
      </HStack>
    </Box>
  )
}

export default StateAndSprint
