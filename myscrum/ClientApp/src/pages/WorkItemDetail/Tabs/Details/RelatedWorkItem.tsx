import { Avatar, Box, HStack, Image, Text } from '@chakra-ui/react'
import { WorkItemLookup } from 'domainTypes'
import { Link } from 'react-router-dom'
import { getAvatarUrl, workItemStateToTextColorMap, workItemTypeToImageMap } from 'utils'

interface RelatedWorkItemProps {
  item: WorkItemLookup
}

const RelatedWorkItem = ({ item }: RelatedWorkItemProps) => {
  return (
    <Box>
      <HStack spacing={1}>
        <Image
          width='15px'
          objectFit='contain'
          maxH='15px'
          src={workItemTypeToImageMap[item.type]}
        />

        <Avatar src={item.assignedTo && getAvatarUrl(item.assignedTo.id)} size='2xs' />

        <Link to={`/work-items/${item.id}`}>
          <Text
            noOfLines={1}
            fontSize='sm'
            color='blue.600'
            _hover={{ textDecoration: 'underline' }}
          >
            {item.title}
          </Text>
        </Link>
      </HStack>

      <HStack spacing={1}>
        <Box
          ml={1}
          width='8px'
          height='8px'
          borderRadius='50%'
          bg={workItemStateToTextColorMap[item.state].color}
        />
        <Text color='gray.500' fontSize='xs'>
          {workItemStateToTextColorMap[item.state].text}
        </Text>
      </HStack>
    </Box>
  )
}

export default RelatedWorkItem
