import { HStack, Text } from '@chakra-ui/layout'

interface InfoItemProps {
  icon: JSX.Element
  name: string
  value: string
}

const InfoItem = ({ icon, name, value }: InfoItemProps) => {
  return (
    <HStack>
      {icon}

      <Text display='inline-block'>
        <Text as='b' color='secondary' display='inline-block' minW='50px'>
          {name}:
        </Text>

        {value}
      </Text>
    </HStack>
  )
}

export default InfoItem
