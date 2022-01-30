import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import FormInput from 'components/elements/HookForm/FormInput'
import FormTextArea from 'components/elements/HookForm/FormTextArea'
import WorkItemActionMenu from 'components/modules/WorkItemActionMenu/WorkItemActionMenu'
import { WorkItemDetail } from 'domainTypes'
import { allowedChildWorkItemsMap } from 'utils'
import RelatedWorkItem from './RelatedWorkItem'
import { canSetRemainingHours, shouldShowRemainingHours } from './utils'

interface DetailsTabProps {
  workItem: WorkItemDetail
  refetch: () => Promise<any>
}

const DetailsTab = ({ workItem, refetch }: DetailsTabProps) => {
  return (
    <Box d='flex' gridGap={10} flexDirection={{ base: 'column', md: 'row' }}>
      <VStack minW={300} alignItems='stretch' flex='1'>
        <Box>
          <Text fontWeight={500} borderBottom='solid 1px' borderColor='gray.200'>
            Description
          </Text>
          <FormTextArea name='description' border='none' pl={0} rows={5} />
        </Box>

        <Box>
          <Text fontWeight={500} borderBottom='solid 1px' borderColor='gray.200'>
            Acceptance Criteria
          </Text>
          <FormTextArea name='acceptationCriteria' border='none' pl={0} rows={5} />
        </Box>

        <Box>
          <Text fontWeight={500} borderBottom='solid 1px' borderColor='gray.200'>
            Implementation Details
          </Text>
          <FormTextArea name='implementationDetails' border='none' pl={0} rows={5} />
        </Box>
      </VStack>

      <Box flex='1'>
        <Text fontWeight={500} borderBottom='solid 1px' borderColor='gray.200'>
          Details
        </Text>

        <Text color='gray.500' fontSize='xs' mt={3} mb={-2}>
          Start Date
        </Text>
        <FormInput name='startDate' type='date' border='none' pl={0} py={0} />

        <Text color='gray.500' fontSize='xs' mt={3} mb={-2}>
          Finish Date
        </Text>
        <FormInput name='finishDate' type='date' border='none' pl={0} py={0} />

        {shouldShowRemainingHours(workItem.type) && (
          <>
            <Text color='gray.500' fontSize='xs' mt={3} mb={-2}>
              Remaining Hours
            </Text>
            <FormInput
              name='remainingHours'
              type='number'
              border='none'
              pl={0}
              py={0}
              isDisabled={!canSetRemainingHours(workItem.type)}
            />
          </>
        )}
      </Box>

      <Box flex='1'>
        <Text fontWeight={500} borderBottom='solid 1px' borderColor='gray.200'>
          Related Work
        </Text>

        {workItem.parent && (
          <>
            <Text color='gray.500' fontSize='xs' mt={3} mb={1}>
              Parent
            </Text>

            <RelatedWorkItem item={workItem.parent} />
          </>
        )}

        {allowedChildWorkItemsMap[workItem.type].length !== 0 && (
          <>
            <HStack alignItems='flex-end'>
              <Text color='gray.500' fontSize='xs' mt={5} mb={1}>
                Child
              </Text>

              <WorkItemActionMenu
                workItem={workItem}
                sprintId={undefined}
                refetch={refetch}
                moveToSprintDisabled
              />
            </HStack>

            <VStack alignItems='flex-start' spacing={3}>
              {workItem.children.map(x => (
                <RelatedWorkItem key={x.id} item={x} />
              ))}
            </VStack>
          </>
        )}
      </Box>
    </Box>
  )
}

export default DetailsTab
