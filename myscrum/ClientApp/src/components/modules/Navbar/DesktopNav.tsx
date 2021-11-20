import Icon from '@chakra-ui/icon'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Link, Stack, Text } from '@chakra-ui/layout'
import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/popover'
import { NavItem } from './utils'

interface DesktopNavProps {
  items: NavItem[]
}

const DesktopNav = ({ items }: DesktopNavProps) => {
  const linkColor = 'gray.600'
  const linkHoverColor = 'gray.800'
  const popoverContentBgColor = 'white'

  return (
    <Stack direction={'row'} spacing={4}>
      {items.map(navItem => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor
                }}
              >
                {navItem.label}
              </Link>
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

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      href={href}
      target='_blank'
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: 'teal.50' }}
    >
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
          <Icon color={'primary'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  )
}

export default DesktopNav
