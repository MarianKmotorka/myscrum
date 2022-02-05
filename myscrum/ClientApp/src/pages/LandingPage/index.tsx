import { Box } from '@chakra-ui/react'

import DefaultLayout from 'components/layouts/DefaultLayout'
import Footer from './Footer'
import ThreeTierPricing from './Pricing'
import TopSection from './TopSection'
import Testimonials from './Testimonials'
import Features from './Features'

export default function Login() {
  return (
    <Box overflowX='hidden'>
      <DefaultLayout>
        <TopSection />
      </DefaultLayout>

      <Features />

      <Testimonials />

      <ThreeTierPricing />

      <Footer />
    </Box>
  )
}
