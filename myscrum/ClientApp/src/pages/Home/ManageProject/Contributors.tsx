import { Button } from '@chakra-ui/button'
import { useDisclosure } from '@chakra-ui/hooks'
import { AddIcon } from '@chakra-ui/icons'
import { Box, HStack, Text } from '@chakra-ui/layout'
import UserItem from 'components/elements/UserItem'
import { Project, User } from 'domainTypes'
import { useAuthorizedUser } from 'services/auth/AuthProvider'
import InviteUsersModal from './InviteUsersModal'
import api from 'api/httpClient'
import { apiErrorToast, successToast } from 'services/toastService'
import { ApiError } from 'api/types'
import { useProjects } from 'services/ProjectsProvider'

interface ContributorsProps {
  project: Project
  closeManageProjectModal: () => void
}

const Contributors = ({
  project: { amIOwner, contributors, owner, id, name },
  closeManageProjectModal
}: ContributorsProps) => {
  const { currentUser } = useAuthorizedUser()
  const { removeContributor, removeProject } = useProjects()
  const { isOpen, onClose, onOpen } = useDisclosure()

  const remove = async (user: User) => {
    try {
      await api.delete(`/projects/${id}/contributors/${user.id}`)
      if (currentUser.id === user.id) {
        successToast(`You left ${name}.`)
        removeProject(id)
        closeManageProjectModal()
      } else {
        successToast(`${user.fullName} was removed.`)
        removeContributor(id, user.id)
      }
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  return (
    <Box>
      <Text mt={5} mb={1} pb={1} fontWeight={500} borderBottom='dashed 1px' borderColor='gray.200'>
        Owner
      </Text>

      <UserItem user={owner} />

      <HStack
        justifyContent='space-between'
        alignItems='center'
        mb={1}
        mt={9}
        borderBottom='dashed 1px'
        borderColor='gray.200'
      >
        <Text fontWeight={500}>Contributors</Text>

        <Button
          variant='ghost'
          leftIcon={<AddIcon />}
          visibility={amIOwner ? undefined : 'hidden'}
          onClick={onOpen}
        >
          Add
        </Button>
      </HStack>

      <UserItem user={owner} />

      {contributors.map(x => {
        const isMe = x.id === currentUser.id

        return (
          <HStack justifyContent='space-between'>
            <UserItem user={x} key={x.id} />

            {(isMe || amIOwner) && (
              <Button onClick={() => remove(x)} variant='outline' colorScheme='red' size='sm'>
                {isMe ? 'Leave' : 'Remove'}
              </Button>
            )}
          </HStack>
        )
      })}

      <InviteUsersModal projectId={id} isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default Contributors
