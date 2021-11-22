import { useDisclosure } from '@chakra-ui/hooks'
import Icon from '@chakra-ui/icon'
import { ChevronDownIcon, TriangleDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/layout'
import { Collapse } from '@chakra-ui/transition'
import { NavItem } from './utils'
import LinkOrNothing from './LinkOrNothing'
import { useProjects } from 'services/ProjectsProvider'
import { useAuth } from 'services/auth/AuthProvider'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/button'
import { useBreakpointValue } from '@chakra-ui/media-query'

interface MobileNavProps {
  items: NavItem[]
}

const MobileNav = ({ items }: MobileNavProps) => {
  const { selectedProject } = useProjects()
  const { isLoggedIn } = useAuth()
  const isSmallScreen = useBreakpointValue({ base: true, md: false })
  return (
    <Stack bg={'white'} p={4} display={{ md: 'none' }}>
      {selectedProject && isLoggedIn && isSmallScreen && (
        <Box display='flex' justifyContent='center'>
          <Link to='/'>
            <Button size='sm' variant='outline' rightIcon={<TriangleDownIcon w='8px' h='8px' />}>
              <Text maxW='200px' overflow='hidden' textOverflow='ellipsis'>
                {selectedProject.name}
              </Text>
            </Button>
          </Link>
        </Box>
      )}

      {items.map(navItem => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href, isExternal }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={ChakraLink}
        href={isExternal ? href : undefined}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none'
        }}
      >
        <LinkOrNothing isNothing={isExternal || !href} to={href || ''}>
          <Text fontWeight={600} color={'gray.600'}>
            {label}
          </Text>
        </LinkOrNothing>

        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={'gray.200'}
          align={'start'}
        >
          {children &&
            children.map(child => (
              <ChakraLink key={child.label} py={2} href={isExternal ? child.href : undefined}>
                <LinkOrNothing isNothing={!!isExternal} to={child.href || ''}>
                  <>{child.label}</>
                </LinkOrNothing>
              </ChakraLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

export default MobileNav
