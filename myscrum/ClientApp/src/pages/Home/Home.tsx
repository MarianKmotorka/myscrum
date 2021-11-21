import { useDisclosure } from '@chakra-ui/hooks'
import { useState } from 'react'
import { AddIcon } from '@chakra-ui/icons'
import { AspectRatio, Box, Grid, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import FetchError from 'components/elements/FetchError'
import { useProjects } from 'services/ProjectsProvider'
import CreateProjectModal from './CreateProjectModal'
import { projectCardProps, selectedCardOverrideProps } from './utils'
import { Project } from 'domainTypes'
import ManageProjectModal from './ManageProject/ManageProjectModal'

const Home = () => {
  const { projects, isLoading, error, selectedProject } = useProjects()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [projectToManage, setProjectToManage] = useState<Project>()

  if (isLoading) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />
  if (error) return <FetchError error={error} />

  return (
    <Box mb={3}>
      <Text fontSize='4xl' mt='20px'>
        Projects
      </Text>
      <Text mb='40px' fontSize='md' color='gray.500'>
        Here you can create or select project to work with.
      </Text>

      <Grid
        templateColumns={{
          base: 'repeat(auto-fit, 140px)',
          md: 'repeat(auto-fit, 170px)',
          lg: 'repeat(auto-fit,230px)'
        }}
        gridGap={{ base: '10px', md: '15px', lg: '20px' }}
      >
        <AspectRatio ratio={1}>
          <Box {...projectCardProps} onClick={onOpen}>
            <AddIcon color='primary' />
          </Box>
        </AspectRatio>

        {projects.map(x => {
          const isSelected = x.id === selectedProject?.id
          const overrideProps = isSelected ? selectedCardOverrideProps : {}

          return (
            <AspectRatio key={x.id} ratio={1}>
              <Box {...projectCardProps} {...overrideProps} onClick={() => setProjectToManage(x)}>
                <Text textDecoration={isSelected ? 'underline' : undefined} noOfLines={3}>
                  {x.name}
                </Text>
              </Box>
            </AspectRatio>
          )
        })}
      </Grid>

      <CreateProjectModal isOpen={isOpen} onClose={onClose} />

      {projectToManage && (
        <ManageProjectModal
          onClose={() => setProjectToManage(undefined)}
          project={projectToManage}
        />
      )}
    </Box>
  )
}

export default Home
