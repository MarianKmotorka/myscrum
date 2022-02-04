import { Box, useBreakpointValue } from '@chakra-ui/react'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'
import { toLocalTime } from 'utils'
import { SprintStatistics } from './types'

interface BurndownChartProps {
  burndown: SprintStatistics['burndownData']
}

const BurndownChart = ({ burndown }: BurndownChartProps) => {
  const width = useBreakpointValue({ base: 420, md: 700 })
  const data = burndown.map(x => ({ ...x, date: toLocalTime(x.date, 'D MMM') }))

  return (
    <Box mb={10} mt={5} overflow='auto'>
      <AreaChart width={width} height={400} data={data}>
        <defs>
          <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#fca311' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#fca311' stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey='date'
          label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
        />
        <YAxis label={{ value: 'Remaining hours', angle: -90, position: 'insideLeft' }} />

        <Tooltip />
        <CartesianGrid strokeDasharray='3 3' />

        <Area
          type='monotone'
          dataKey='remainingHours'
          stroke='#14213d'
          fillOpacity={1}
          fill='url(#color)'
        />
      </AreaChart>
    </Box>
  )
}

export default BurndownChart
