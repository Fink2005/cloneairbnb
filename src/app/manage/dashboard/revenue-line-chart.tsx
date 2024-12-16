'use client'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartData {
  date: string
  revenue: number
}

interface RevenueLineChartProps {
  chartData: ChartData[]
}

export function RevenueLineChart({ chartData }: RevenueLineChartProps) {
  const options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Revenue Over Time'
    },
    xAxis: {
      categories: chartData.map(item => item.date)
    },
    yAxis: {
      title: {
        text: 'Revenue'
      }
    },
    series: [
      {
        name: 'Revenue',
        data: chartData.map(item => item.revenue)
      }
    ]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* Additional footer content */}
      </CardFooter>
    </Card>
  )
}
