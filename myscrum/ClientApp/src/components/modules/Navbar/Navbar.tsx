import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  Collapse,
  Container,
  Menu,
  HStack,
  VStack,
  Text,
  MenuItem,
  MenuList,
  Avatar,
  MenuButton,
  useBreakpointValue,
  useDisclosure,
  Badge
} from '@chakra-ui/react'
import { BiEnvelope } from 'react-icons/bi'
import { AiOutlinePushpin } from 'react-icons/ai'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, TriangleDownIcon } from '@chakra-ui/icons'
import useRedirectToGoogleSignIn from 'services/auth/useRedirectToGoogleSignIn'
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'
import { useAuth } from 'services/auth/AuthProvider'
import { NAV_ITEMS } from './utils'
import { getAvatarUrl } from 'utils'
import { useNavigate } from 'react-router'
import { useProjects } from 'services/ProjectsProvider'
import { Link } from 'react-router-dom'
import { SystemRole } from 'domainTypes'

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const redirect = useRedirectToGoogleSignIn()
  const { selectedProject } = useProjects()
  const isSmallScreen = useBreakpointValue({ base: true, md: false })
  const auth = useAuth()
  const { isLoggedIn } = auth
  const navigate = useNavigate()
  const navItems = isLoggedIn && selectedProject ? NAV_ITEMS : []
  const burgerVisible = !!navItems.length

  return (
    <Box bg='bg' position='sticky' top='0px' zIndex={10}>
      <Container maxW='6xl'>
        <Flex color={'gray.700'} minH={'60px'} py={{ base: 2 }} align={'center'}>
          {burgerVisible && (
            <Flex
              flex={{ base: 0, md: 'auto' }}
              ml={{ base: -2 }}
              display={{ base: 'flex', md: 'none' }}
            >
              <IconButton
                onClick={onToggle}
                icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
              />
            </Flex>
          )}

          <Flex
            flex={{ base: 1 }}
            alignItems='center'
            justify={{ base: burgerVisible ? 'center' : 'start', md: 'start' }}
          >
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily="'Pacifico', cursive"
              fontSize='2xl'
              lineHeight='43px'
              bg='linear-gradient(to right,var(--chakra-colors-primary), #ff7600)'
              backgroundClip='text'
              color='transparent'
              cursor='pointer'
              onClick={() => navigate('/')}
            >
              myScrum
            </Text>

            {isLoggedIn && !isSmallScreen && (
              <Link to='/'>
                <Button
                  ml={3}
                  size='xs'
                  variant={selectedProject ? 'secondaryOutline' : 'ghost'}
                  rightIcon={
                    selectedProject ? <AiOutlinePushpin /> : <TriangleDownIcon w='8px' h='8px' />
                  }
                >
                  <Text maxW='200px' overflow='hidden' textOverflow='ellipsis'>
                    {selectedProject?.name || 'Select project'}
                  </Text>
                </Button>
              </Link>
            )}

            <Flex display={{ base: 'none', md: 'flex' }} alignItems='center' ml={10}>
              <DesktopNav items={navItems} />
            </Flex>
          </Flex>

          {!isLoggedIn && (
            <Stack flex={{ base: 1, md: 0 }} justify='flex-end' direction='row' spacing={6}>
              <Button
                fontSize='sm'
                fontWeight={400}
                variant='link'
                color='secondary'
                onClick={redirect}
              >
                Sign In
              </Button>

              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                variant='primary'
                onClick={redirect}
              >
                Get started
              </Button>
            </Stack>
          )}

          {isLoggedIn && (
            <HStack>
              {!isSmallScreen && (
                <Link to='/invitations'>
                  <IconButton aria-label='invitations' mr={3} variant='outline' size='md'>
                    <Box position='relative'>
                      <BiEnvelope />

                      {!!auth.currentUser.projectInvitationCount && (
                        <Badge
                          bg='primary'
                          color='white'
                          rounded='full'
                          position='absolute'
                          top='-15px'
                          right='-15px'
                        >
                          {auth.currentUser.projectInvitationCount}
                        </Badge>
                      )}
                    </Box>
                  </IconButton>
                </Link>
              )}

              <Menu>
                <MenuButton py={2} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
                  <HStack>
                    <Avatar size={'sm'} src={getAvatarUrl(auth.currentUser.id)} />
                    <VStack
                      display={{ base: 'none', md: 'flex' }}
                      alignItems='flex-start'
                      spacing='-3px'
                      ml='2'
                    >
                      <Text fontSize='sm'>
                        {auth.currentUser.givenName} {auth.currentUser.surname}
                      </Text>
                      <Text fontSize='xs' color='gray.600'>
                        {auth.currentUser.email}
                      </Text>
                    </VStack>

                    <Box display={{ base: 'none', md: 'flex' }}>
                      <ChevronDownIcon />
                    </Box>
                  </HStack>
                </MenuButton>

                <MenuList bg='white' borderColor='gray.200'>
                  {auth.currentUser.role === SystemRole.Admin && (
                    <Link to='/admin'>
                      <MenuItem>Admin</MenuItem>
                    </Link>
                  )}

                  <MenuItem onClick={() => auth.logout()}>Sign out</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          )}
        </Flex>
      </Container>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav items={navItems} />
      </Collapse>
    </Box>
  )
}
