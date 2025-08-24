'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useChartTheme } from '@/hooks/useChartTheme'
import { createChartOptions, getChartTheme } from '@/lib/chartThemes'

// Dynamic import to prevent SSR issues
const Radar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Radar), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

// Import Chart.js components
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface RadarChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
      borderWidth?: number
      pointBackgroundColor?: string
      pointBorderColor?: string
      pointHoverBackgroundColor?: string
      pointHoverBorderColor?: string
    }[]
  }
  title?: string
  className?: string
}

function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-400 dark:text-gray-500">Loading chart...</div>
    </div>
  )
}

export function RadarChart({ data, title, className = '' }: RadarChartProps) {
  const { isDark, mounted, containerRef, registerChart, themeChanged } = useChartTheme()
  const [chartKey, setChartKey] = useState(0)
  const chartInstanceRef = useRef<any>(null)

  // Force re-render when theme changes
  useEffect(() => {
    if (themeChanged && mounted) {
      setChartKey(prev => prev + 1)
    }
  }, [themeChanged, mounted])

  if (!mounted) {
    return <ChartSkeleton />
  }

  const theme = getChartTheme(isDark)
  const baseOptions = createChartOptions(isDark, title)
  
  const options = {
    ...baseOptions,
    scales: {
      r: {
        angleLines: {
          color: theme.grid.borderColor
        },
        grid: {
          color: theme.grid.color
        },
        pointLabels: {
          color: theme.text.secondary,
          font: {
            size: 11
          }
        },
        ticks: {
          color: theme.text.muted,
          font: {
            size: 10
          },
          backdropColor: theme.background
        }
      }
    },
    onHover: (event: any, elements: any[]) => {
      if (containerRef.current) {
        containerRef.current.style.cursor = elements.length > 0 ? 'pointer' : 'default'
      }
    }
  }

  // Apply theme-aware colors to data
  const themedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const color = theme.colors.primary[index % theme.colors.primary.length]
      return {
        ...dataset,
        backgroundColor: dataset.backgroundColor || `${color}20`,
        borderColor: dataset.borderColor || color,
        borderWidth: dataset.borderWidth || 2,
        pointBackgroundColor: dataset.pointBackgroundColor || color,
        pointBorderColor: dataset.pointBorderColor || theme.background,
        pointHoverBackgroundColor: dataset.pointHoverBackgroundColor || theme.background,
        pointHoverBorderColor: dataset.pointHoverBorderColor || color
      }
    })
  }

  const handleChartRef = (chart: any) => {
    if (chart) {
      chartInstanceRef.current = chart
      registerChart(chart)
    }
  }

  return (
    <div ref={containerRef} className={`w-full h-64 transition-opacity duration-200 ${className}`}>
      <Radar 
        key={chartKey}
        ref={handleChartRef}
        data={themedData} 
        options={options}
        redraw={themeChanged}
      />
    </div>
  )
}