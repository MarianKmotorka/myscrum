import { Stack, Flex, Heading, Text, Button, Image, Box } from '@chakra-ui/react'

import LoginBlob from './LoginBlob'
import DefaultLayout from 'components/layouts/DefaultLayout'
import useRedirectToGoogleSignIn from 'services/auth/useRedirectToGoogleSignIn'

export default function Login() {
  const redirect = useRedirectToGoogleSignIn()

  return (
    <Box overflowX='hidden' h='100vh'>
      <DefaultLayout>
        <Stack
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Stack flex={1} spacing={{ base: 5, md: 10 }}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
            >
              <Text
                as={'span'}
                position={'relative'}
                _after={{
                  content: "''",
                  width: 'full',
                  height: '30%',
                  position: 'absolute',
                  bottom: 1,
                  left: 0,
                  bg: 'secondary',
                  zIndex: -1
                }}
              >
                Number 1 tool
              </Text>
              <br />
              <Text as={'span'} color={'primary.700'}>
                for scrum teams!
              </Text>
            </Heading>

            <Text color={'gray.500'}>
              My scrum is snippy tool for your every day scrum management. It lets you organize all
              the work and assign it to your people quickly. And it is all for FREE!
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

              <Button size={'lg'} fontWeight={'normal'} px={6} rounded='full'>
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
              src={
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2370&q=80'
              }
            />

            <LoginBlob
              w={'100%'}
              h={'100%'}
              position={'absolute'}
              top={'50%'}
              left='20%'
              zIndex={-1}
              color='secondary'
            />
          </Flex>
        </Stack>
      </DefaultLayout>
    </Box>
  )
}
