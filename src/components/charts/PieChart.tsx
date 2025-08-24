'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useChartTheme } from '@/hooks/useChartTheme'
import { createChartOptions, applyThemeToArcDatasets } from '@/lib/chartThemes'

// Dynamic import to prevent SSR issues
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
  ssr: false,
  loading: () => <ChartSkeleton />
})

// Import Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PieChartProps {
  data: {
    labels: string[]
    datasets: {
      label?: string
      data: number[]
      backgroundColor?: string[]
      borderColor?: string[]
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

export function PieChart({ data, title, className = '' }: PieChartProps) {
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
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins.legend,
        position: 'bottom' as const
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
          label: function(context: any) {
            const label = context.label || ''
            const value = context.parsed
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value} (${percentage}%)`
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
    datasets: applyThemeToArcDatasets(data.datasets, isDark, 0.9)
  }

  const handleChartRef = (chart: any) => {
    if (chart) {
      chartInstanceRef.current = chart
      registerChart(chart)
    }
  }

  return (
    <div ref={containerRef} className={`w-full h-64 transition-opacity duration-200 ${className}`}>
      <Pie 
        key={chartKey}
        ref={handleChartRef}
        data={themedData} 
        options={options}
        redraw={themeChanged}
      />
    </div>
  )
}