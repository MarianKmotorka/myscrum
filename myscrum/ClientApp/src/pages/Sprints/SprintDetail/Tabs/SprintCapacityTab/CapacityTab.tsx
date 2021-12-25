import { ApiError } from 'api/types'
import { SprintSetting } from 'domainTypes'
import { useQuery, useQueryClient } from 'react-query'
import { useSelectedProject } from 'services/ProjectsProvider'
import api from 'api/httpClient'
import FetchError from 'components/elements/FetchError'
import {
  Avatar,
  Box,
  Button,
  HStack,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
import Form from 'components/elements/HookForm/Form'
import { useSubmitForm } from 'components/elements/HookForm/hooks/useSubmitForm'
import { getAvatarUrl } from 'utils'
import FormInput from 'components/elements/HookForm/FormInput'
import { css } from '@emotion/react'
import { combineValidators, maxNumericValue, minNumericValue } from 'utils/validators'
import { errorToastIfNotValidationError, successToast } from 'services/toastService'

interface CapacityTabProps {
  sprintId: string
}

const CapacityTab = ({ sprintId }: CapacityTabProps) => {
  const { id: projectId } = useSelectedProject()
  const { data, error, isLoading, refetch } = useQuery<SprintSetting[], ApiError>(
    ['sprints', sprintId, 'settings', { projectId }],
    async () => (await api.get(`/sprints/${sprintId}/settings`, { params: { projectId } })).data
  )

  const { onSubmit, submitting } = useSubmitForm<Record<string, number>>({
    url: `/sprints/${sprintId}/settings`,
    method: 'put',
    formatter: values => {
      const userIds = data!.map(x => x.user.id)
      const settings = userIds.map(id => ({
        userId: id,
        daysOff: Math.floor(values[`daysOff_${id}`]!),
        capacityPerDay: Math.floor(values[`capacityPerDay_${id}`]!)
      }))

      return {
        settings,
        projectId
      }
    },
    errorCallback: errorToastIfNotValidationError,
    successCallback: () => {
      successToast('Saved')
      refetch()
    }
  })

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='2px' color='gray.500' size='lg' mt='20px' />

  const defaultValue = data.reduce(
    (acc, { user, daysOff, capacityPerDay }) => ({
      ...acc,
      [`daysOff_${user.id}`]: daysOff,
      [`capacityPerDay_${user.id}`]: capacityPerDay
    }),
    {}
  )

  return (
    <Box overflowX='auto'>
      <Form debug onSubmit={onSubmit} defaultValues={defaultValue}>
        {({ formState: { isDirty } }) => (
          <>
            <HStack justifyContent='flex-end'>
              <Button
                variant='secondary'
                type='submit'
                isDisabled={!isDirty}
                isLoading={submitting}
              >
                Save
              </Button>
            </HStack>

            <Table
              minW={600}
              css={css`
                td,
                th {
                  border-color: transparent;
                  padding: 5px 0;
                }
              `}
            >
              <Thead>
                <Tr>
                  <Th></Th>
                  <Th>Days off</Th>
                  <Th>Capacity per day</Th>
                </Tr>
              </Thead>

              <Tbody>
                {data.map(({ user }) => (
                  <Tr key={user.id}>
                    <Td>
                      <HStack>
                        <Avatar src={getAvatarUrl(user.id)} />
                        <Text>{user.fullName}</Text>
                      </HStack>
                    </Td>

                    <Td pr='20px !important'>
                      <FormInput
                        name={`daysOff_${user.id}`}
                        type='number'
                        validate={minNumericValue(0)}
                      />
                    </Td>

                    <Td>
                      <FormInput
                        name={`capacityPerDay_${user.id}`}
                        type='number'
                        validate={combineValidators([minNumericValue(0), maxNumericValue(24)])}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Form>
    </Box>
  )
}

export default CapacityTab
