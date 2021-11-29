import { useDisclosure } from '@chakra-ui/hooks'
import { useState, useEffect } from 'react'
import { AddIcon, StarIcon } from '@chakra-ui/icons'
import { AspectRatio, Box, Grid, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import FetchError from 'components/elements/FetchError'
import { useProjects } from 'services/ProjectsProvider'
import CreateProjectModal from './CreateProjectModal'
import { projectCardProps, selectedCardOverrideProps } from './utils'
import { Project } from 'domainTypes'
import ManageProjectModal from './ManageProject/ManageProjectModal'
import { IconButton } from '@chakra-ui/react'
import { FiRefreshCcw } from 'react-icons/fi'

const Home = () => {
  const { projects, isLoading, error, selectedProject, refetch, isFetching } = useProjects()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [projectToManage, setProjectToManage] = useState<Project>()

  useEffect(() => {
    if (!projectToManage) return
    setProjectToManage(projects.find(x => x.id === projectToManage.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  if (isLoading) return <Spinner thickness='4px' color='gray.500' size='xl' mt='30px' />
  if (error) return <FetchError error={error} />

  return (
    <Box mb={3}>
      <Text fontSize='4xl' mt={5}>
        Projects
        <IconButton aria-label='refresh' ml={4} onClick={refetch} isLoading={isFetching}>
          <FiRefreshCcw />
        </IconButton>
      </Text>

      <Text my={3} fontSize='md' color='gray.600'>
        Here you can create or select project to work with.
      </Text>

      <Text mt={10} mb={10} fontSize='md' color='gray.600' fontStyle='italic'>
        <StarIcon color='gray.500' /> - indicates that you are the owner of the project
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
            <AddIcon color='linkedin.700' />
          </Box>
        </AspectRatio>

        {projects.map(x => {
          const isSelected = x.id === selectedProject?.id
          const overrideProps = isSelected ? selectedCardOverrideProps : {}

          return (
            <AspectRatio key={x.id} ratio={1}>
              <Box {...projectCardProps} {...overrideProps} onClick={() => setProjectToManage(x)}>
                {x.amIOwner && <StarIcon position='absolute' right={2} top={2} color='gray.500' />}
                <Text noOfLines={3}>{x.name}</Text>
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
