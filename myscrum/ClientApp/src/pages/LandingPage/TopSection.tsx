import { Button, Flex, Heading, Image, Stack, Text } from '@chakra-ui/react'
import useRedirectToGoogleSignIn from 'services/auth/useRedirectToGoogleSignIn'
import Blob from './Blob'
import itTeam from '../../img/landing/it-team-min.jpg'

const TopSection = () => {
  const redirect = useRedirectToGoogleSignIn()

  return (
    <Stack
      align={'center'}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading lineHeight={1.1} fontWeight={600} fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
          <Text
            as='span'
            position='relative'
            color='secondary'
            _after={{
              content: "''",
              width: 'full',
              height: '30%',
              position: 'absolute',
              bottom: 1,
              left: 0,
              bg: 'gray.100',
              zIndex: -1
            }}
          >
            Number{' '}
            <Text
              lineHeight='50px'
              fontSize='3rem'
              fontWeight={400}
              as='span'
              background='white'
              color='primary'
              border='solid 2px'
              borderRadius='100px'
              width='55px'
              display='inline-block'
              textAlign='center'
            >
              1
            </Text>{' '}
            tool
          </Text>
          <br />
          <Text as={'span'} color='secondary'>
            for scrum teams!
          </Text>
        </Heading>

        <Text color={'gray.600'}>
          My scrum is snippy tool for your every day scrum management. It lets you organize all the
          work and assign it to your people quickly. And it is all for FREE!
        </Text>

        <Stack spacing={{ base: 4, sm: 6 }} direction={{ base: 'column', sm: 'row' }}>
          <Button
            size={'lg'}
            fontWeight={'normal'}
            px={6}
            rounded='full'
            variant='primary'
            onClick={redirect}
          >
            Get started
          </Button>

          <Button
            as='a'
            href='#landingpage_features'
            variant='secondaryOutline'
            size={'lg'}
            fontWeight={'normal'}
            px={6}
            rounded='full'
          >
            How It Works
          </Button>
        </Stack>
      </Stack>

      <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
        <Image
          fit={'cover'}
          w={'100%'}
          h={'100%'}
          borderRadius='lg'
          boxShadow='30px 30px 50px rgba(0,0,0,0.4)'
          src={itTeam}
        />

        <Blob
          w={'100%'}
          h={'100%'}
          position={'absolute'}
          top={'50%'}
          left='20%'
          zIndex={-1}
          color='gray.50'
        />
      </Flex>
    </Stack>
  )
}

export default TopSection
