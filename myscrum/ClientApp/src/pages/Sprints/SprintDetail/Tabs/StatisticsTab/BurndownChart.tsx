import { Box, Text } from '@chakra-ui/react'
import { Area, AreaChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { SprintStatistics } from './types'

interface BurndownChartProps {
  burndown: SprintStatistics['burndown']
}

const BurndownChart = ({ burndown }: BurndownChartProps) => {
  burndown = [
    { date: '1.1.', remainingHours: 30 },
    { date: '1.2.', remainingHours: 20 },
    { date: '1.3.', remainingHours: 37 },
    { date: '1.4.', remainingHours: 9 },
    { date: '1.5.', remainingHours: 9 },
    { date: '1.6.', remainingHours: 13 },
    { date: '1.7.', remainingHours: 10 },
    { date: '1.8.', remainingHours: 2 },
    { date: '1.9.', remainingHours: 0 }
  ]

  return (
    <Box mb={10}>
      <AreaChart width={700} height={400} data={burndown}>
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
