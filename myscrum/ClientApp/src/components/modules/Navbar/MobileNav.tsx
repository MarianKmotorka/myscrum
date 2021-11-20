import { useDisclosure } from '@chakra-ui/hooks'
import Icon from '@chakra-ui/icon'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/layout'
import { Collapse } from '@chakra-ui/transition'
import { NavItem } from './utils'
import LinkOrNothing from './LinkOrNothing'

interface MobileNavProps {
  items: NavItem[]
}

const MobileNav = ({ items }: MobileNavProps) => {
  return (
    <Stack bg={'white'} p={4} display={{ md: 'none' }}>
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
