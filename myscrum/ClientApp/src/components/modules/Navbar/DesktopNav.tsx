import Icon from '@chakra-ui/icon'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Link as ChakraLink, Stack, Text } from '@chakra-ui/layout'
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/popover'
import { NavItem } from './utils'
import LinkOrNothing from './LinkOrNothing'

interface DesktopNavProps {
  items: NavItem[]
}

const DesktopNav = ({ items }: DesktopNavProps) => {
  const linkColor = 'secondary'
  const popoverContentBgColor = 'white'

  return (
    <Stack direction={'row'} spacing={4}>
      {items.map(navItem => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <ChakraLink
                p={2}
                href={navItem.isExternal ? navItem.href : undefined}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none'
                }}
              >
                <LinkOrNothing
                  isNothing={navItem.isExternal || !navItem.href}
                  to={navItem.href || ''}
                >
                  <>{navItem.label}</>
                </LinkOrNothing>
              </ChakraLink>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map(child => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel, isExternal }: NavItem) => {
  return (
    <ChakraLink
      href={isExternal ? href : undefined}
      target='_blank'
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: 'bg' }}
    >
      <LinkOrNothing isNothing={!!isExternal} to={href || ''}>
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text transition={'all .3s ease'} _groupHover={{ color: 'primary' }} fontWeight={500}>
              {label}
            </Text>
            <Text fontSize={'sm'}>{subLabel}</Text>
          </Box>

          <Flex
            transition={'all .3s ease'}
            transform={'translateX(-10px)'}
            opacity={0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}
          >
            <Icon color='primary' w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </LinkOrNothing>
    </ChakraLink>
  )
}

export default DesktopNav
