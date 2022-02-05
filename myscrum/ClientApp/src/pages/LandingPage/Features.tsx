import { Box, Container, Heading, Image, useBreakpointValue } from '@chakra-ui/react'
import sprintImg from '../../img/landing/sprint-backlog-min.png'
import pbiDetail from '../../img/landing/pbi_detail-min.png'
import retro from '../../img/landing/retro-min.png'
import burndown from '../../img/landing/burndown-min.png'
import bugDisc from '../../img/landing/bug-discussion-min.jpg'
import assignedWork from '../../img/landing/assigned-work-min.png'

export default function Features() {
  const titleSize = useBreakpointValue({ base: '1.3rem', md: '4xl' })

  return (
    <Box>
      <Box background='gray.50'>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              In sprint backlog you can organize and prioritize your tasks
            </Heading>

            <Box>
              <Image mx='auto' src={sprintImg} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Specify what needs to be done
            </Heading>

            <Box>
              <Image mx='auto' src={pbiDetail} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box background='gray.50'>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Discuss about the problem
            </Heading>

            <Box>
              <Image mx='auto' src={bugDisc} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Monitor your team's assigned work
            </Heading>

            <Box>
              <Image mx='auto' src={assignedWork} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box background='gray.50'>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Analyze the burndown trend
            </Heading>

            <Box>
              <Image mx='auto' src={burndown} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Sort out what went well and what didn't
            </Heading>

            <Box>
              <Image mx='auto' src={retro} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
