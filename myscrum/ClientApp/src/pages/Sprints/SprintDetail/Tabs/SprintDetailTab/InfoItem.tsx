import { HStack, Text } from '@chakra-ui/layout'
import { css } from '@emotion/react'

interface InfoItemProps {
  icon: JSX.Element
  name: string
  value: string
}

const InfoItem = ({ icon, name, value }: InfoItemProps) => {
  return (
    <HStack
      css={css`
        svg {
          color: var(--chakra-colors-primary);
        }
      `}
    >
      {icon}

      <Text display='inline-block' fontSize='lg'>
        <Text as='b' fontWeight={500} display='inline-block' minW='60px'>
          {name}:
        </Text>

        {value}
      </Text>
    </HStack>
  )
}

export default InfoItem
