"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DataPoint {
  [key: string]: any
}

interface BarChartProps {
  data: DataPoint[]
  xAxisKey: string
  bars: Array<{
    dataKey: string
    name: string
    color: string
  }>
  title?: string
  description?: string
  height?: number
  layout?: 'horizontal' | 'vertical'
}

export function BarChart({
  data,
  xAxisKey,
  bars,
  title,
  description,
  height = 300,
  layout = 'vertical'
}: BarChartProps) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout={layout}
          >
            <CartesianGrid strokeDasharray="3 3" />
            {layout === 'vertical' ? (
              <>
                <XAxis dataKey={xAxisKey} />
                <YAxis />
              </>
            ) : (
              <>
                <XAxis type="number" />
                <YAxis dataKey={xAxisKey} type="category" />
              </>
            )}
            <Tooltip />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={index}
                dataKey={bar.dataKey}
                name={bar.name}
                fill={bar.color}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}