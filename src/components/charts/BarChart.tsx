'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useChartTheme } from '@/hooks/useChartTheme'
import { createChartOptions, applyThemeToDatasets } from '@/lib/chartThemes'

// Dynamic import to prevent SSR issues
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface BarChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
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

export function BarChart({ data, title, className = '' }: BarChartProps) {
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

  const baseOptions = createChartOptions(isDark, title)
  const options = {
    ...baseOptions,
    scales: {
      x: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
          borderColor: isDark ? '#4b5563' : '#d1d5db'
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#e5e7eb',
          borderColor: isDark ? '#4b5563' : '#d1d5db'
        },
        ticks: {
          color: isDark ? '#d1d5db' : '#6b7280',
          font: {
            size: 11
          }
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
    datasets: applyThemeToDatasets(data.datasets, isDark, 'primary')
  }

  const handleChartRef = (chart: any) => {
    if (chart) {
      chartInstanceRef.current = chart
      registerChart(chart)
    }
  }

  return (
    <div ref={containerRef} className={`w-full h-64 transition-opacity duration-200 ${className}`}>
      <Bar 
        key={chartKey}
        ref={handleChartRef}
        data={themedData} 
        options={options}
        redraw={themeChanged}
      />
    </div>
  )
}