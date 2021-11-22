import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { ModalBody, ModalFooter, Button, HStack, Spinner, Text, Input } from '@chakra-ui/react'
import api from 'api/httpClient'
import { useQuery } from 'react-query'
import { useState } from 'react'
import useDebounce from 'utils/useDebounce'
import FetchError from 'components/elements/FetchError'
import { ApiError } from 'api/types'
import { User } from 'domainTypes'
import UserItem from 'components/elements/UserItem'
import { apiErrorToast, successToast } from 'services/toastService'
import { CheckIcon } from '@chakra-ui/icons'

interface InviteUsersProps {
  projectId: string
  onClose: () => void
  isOpen: boolean
}

const InviteUsersModal = ({ projectId, onClose, isOpen }: InviteUsersProps) => {
  const [search, setSearch] = useState('')
  const [invitedIds, setInvitedIds] = useState<string[]>([])
  const debounced = useDebounce(search)

  const { data, isLoading, isFetching, error } = useQuery<User[], ApiError>(
    ['projects', projectId, 'users-to-invite', debounced],
    async () =>
      await (
        await api.get(`/projects/${projectId}/users-to-invite?search=${debounced}`)
      ).data,
    { enabled: debounced.length > 2 }
  )

  const invite = async (user: User) => {
    if (invitedIds.includes(user.id)) return

    try {
      await api.post(`/projects/${projectId}/invite`, { invitedId: user.id })
      successToast(`${user.fullName} was invited.`)
      setInvitedIds(x => [...x, user.id])
    } catch (err) {
      apiErrorToast(err as ApiError)
    }
  }

  if (error) return <FetchError error={error} />

  const loading = isLoading || isFetching

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Invite Contributors</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Input
            placeholder='Search for people'
            value={search}
            onChange={e => setSearch(e.target.value)}
            mb={5}
          />

          {search.length >= 3 && !loading && data?.length === 0 && <Text mt={3}>No results</Text>}

          {loading && <Spinner />}

          {data?.map(x => (
            <HStack justifyContent='space-between'>
              <UserItem user={x} key={x.id} />

              <Button variant='outline' onClick={() => invite(x)}>
                {invitedIds.includes(x.id) ? <CheckIcon /> : 'Invite'}
              </Button>
            </HStack>
          ))}
        </ModalBody>

        <ModalFooter mt={5} borderTop='solid 1px' borderColor='gray.200'>
          <Button onClick={onClose}>Done</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default InviteUsersModal
