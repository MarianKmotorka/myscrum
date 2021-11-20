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
  MenuDivider,
  Avatar,
  MenuButton,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import useRedirectToGoogleSignIn from 'services/auth/useRedirectToGoogleSignIn'
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'
import { useAuth } from 'services/auth/AuthProvider'
import { LOGGED_OUT_NAV_ITEMS, NAV_ITEMS } from './utils'
import { getAvatarUrl } from 'utils'

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const redirect = useRedirectToGoogleSignIn()
  const auth = useAuth()
  const { isLoggedIn } = auth

  const navItems = isLoggedIn ? NAV_ITEMS : LOGGED_OUT_NAV_ITEMS

  return (
    <Box
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={'gray.200'}
      bg={'white'}
      position='sticky'
      top='0px'
    >
      <Container maxW='5xl'>
        <Flex color={'gray.700'} minH={'60px'} py={{ base: 2 }} align={'center'}>
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

          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily="'Pacifico', cursive"
              fontSize='2xl'
              lineHeight='43px'
              bg='linear-gradient(to right,#500472, #79cbb8)'
              backgroundClip='text'
              color='transparent'
            >
              myscrum
            </Text>

            <Flex display={{ base: 'none', md: 'flex' }} alignItems='center' ml={10}>
              <DesktopNav items={navItems} />
            </Flex>
          </Flex>

          {!isLoggedIn && (
            <Stack flex={{ base: 1, md: 0 }} justify='flex-end' direction='row' spacing={6}>
              <Button fontSize={'sm'} fontWeight={400} variant={'link'} onClick={redirect}>
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
            <Menu>
              <MenuButton py={2} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar size={'sm'} src={getAvatarUrl(auth.currentUser.email)} />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems='flex-start'
                    spacing='1px'
                    ml='2'
                  >
                    <Text fontSize='sm'>
                      {auth.currentUser.givenName} {auth.currentUser.surname}
                    </Text>
                  </VStack>

                  <Box display={{ base: 'none', md: 'flex' }}>
                    <ChevronDownIcon />
                  </Box>
                </HStack>
              </MenuButton>

              <MenuList bg='white' borderColor='gray.200'>
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => auth.logout()}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Container>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav items={navItems} />
      </Collapse>
    </Box>
  )
}
