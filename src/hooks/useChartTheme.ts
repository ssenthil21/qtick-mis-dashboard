'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Chart } from 'chart.js'
import { useThrottledCallback } from '@/lib/performance'

export function useChartTheme() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const chartRef = useRef<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const previousTheme = useRef<string | undefined>(theme)
  const isTransitioning = useRef(false)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Throttled theme change handler to prevent rapid re-renders
  const handleThemeChange = useThrottledCallback(() => {
    if (mounted && chartRef.current && previousTheme.current !== theme && !isTransitioning.current) {
      isTransitioning.current = true
      const chart = chartRef.current
      
      // Use requestAnimationFrame for smooth transitions
      if (containerRef.current) {
        containerRef.current.style.opacity = '0.5'
        containerRef.current.style.transition = 'opacity 200ms ease-in-out'
      }
      
      animationFrameRef.current = requestAnimationFrame(() => {
        setTimeout(() => {
          if (chart) {
            chart.destroy()
          }
          chartRef.current = null
          
          // Trigger re-render by updating a state or calling a callback
          if (containerRef.current) {
            containerRef.current.style.opacity = '1'
          }
          
          isTransitioning.current = false
        }, 200)
      })
    }
    
    previousTheme.current = theme
  }, 100) // Throttle theme changes to max once per 100ms

  useEffect(() => {
    handleThemeChange()
  }, [theme, mounted, handleThemeChange])

  const registerChart = useCallback((chart: Chart) => {
    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy()
    }
    chartRef.current = chart
  }, [])

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
  }, [])

  // Optimized chart update function
  const updateChartData = useCallback((newData: any) => {
    if (chartRef.current) {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        if (chartRef.current) {
          chartRef.current.data = newData
          chartRef.current.update('none') // Skip animations for better performance
        }
      })
    }
  }, [])

  // Memory cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      destroyChart()
    }
  }, [destroyChart])

  return {
    isDark: theme === 'dark',
    mounted,
    containerRef,
    registerChart,
    destroyChart,
    updateChartData,
    themeChanged: previousTheme.current !== theme,
    isTransitioning: isTransitioning.current
  }
}