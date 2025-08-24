// KPI utility functions
import React from 'react'
import { useMemoizedCalculation } from './performance'

export interface KpiData {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period?: string
  }
  gradient: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'pink'
  tooltip?: string
  icon?: string // Icon name or identifier
}

/**
 * Format a number value for display in KPI cards
 */
export function formatKpiValue(value: number, type: 'currency' | 'number' | 'percentage' = 'number'): string {
  switch (type) {
    case 'currency':
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`
      }
      return `$${value.toLocaleString()}`
    
    case 'percentage':
      return `${value.toFixed(1)}%`
    
    case 'number':
    default:
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
      }
      return value.toLocaleString()
  }
}

/**
 * Calculate percentage change between two values
 */
export function calculateChange(current: number, previous: number): {
  value: number
  type: 'increase' | 'decrease'
} {
  if (previous === 0) {
    return { value: 0, type: 'increase' }
  }
  
  const change = ((current - previous) / previous) * 100
  return {
    value: Math.abs(change),
    type: change >= 0 ? 'increase' : 'decrease'
  }
}

/**
 * Get appropriate gradient color based on KPI type and performance
 */
export function getKpiGradient(
  type: 'clients' | 'revenue' | 'health' | 'satisfaction' | 'conversion' | 'growth',
  _performance?: 'good' | 'average' | 'poor'
): 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'pink' {
  const gradientMap = {
    clients: 'blue',
    revenue: 'green',
    health: 'orange',
    satisfaction: 'teal',
    conversion: 'purple',
    growth: 'pink'
  } as const

  // Could be extended to consider performance level
  return gradientMap[type] || 'blue'
}

/**
 * Generate tooltip text for common KPI types
 */
export function generateKpiTooltip(
  type: 'clients' | 'revenue' | 'health' | 'satisfaction' | 'conversion' | 'growth',
  value: string | number,
  period?: string
): string {
  const tooltipMap = {
    clients: `Total number of active clients${period ? ` ${period}` : ''}`,
    revenue: `Total revenue generated${period ? ` ${period}` : ''}`,
    health: `Average health score across all clients${period ? ` ${period}` : ''}`,
    satisfaction: `Average customer satisfaction rating${period ? ` ${period}` : ''}`,
    conversion: `Percentage of trial users who converted to paid${period ? ` ${period}` : ''}`,
    growth: `Growth rate compared to previous period${period ? ` ${period}` : ''}`
  }

  return tooltipMap[type] || `${type} metric: ${value}`
}

/**
 * Create a complete KPI data object
 */
export function createKpiData(
  type: 'clients' | 'revenue' | 'health' | 'satisfaction' | 'conversion' | 'growth',
  value: number,
  previousValue?: number,
  period?: string,
  customTitle?: string,
  customTooltip?: string
): KpiData {
  const titles = {
    clients: 'Total Clients',
    revenue: 'Monthly Revenue',
    health: 'Health Score',
    satisfaction: 'Customer Satisfaction',
    conversion: 'Trial Conversions',
    growth: 'Growth Rate'
  }

  const valueTypes = {
    clients: 'number',
    revenue: 'currency',
    health: 'percentage',
    satisfaction: 'number',
    conversion: 'percentage',
    growth: 'percentage'
  } as const

  const formattedValue = type === 'satisfaction' 
    ? `${value.toFixed(1)}/5`
    : formatKpiValue(value, valueTypes[type] as 'currency' | 'number' | 'percentage')

  const change = previousValue ? calculateChange(value, previousValue) : undefined

  return {
    title: customTitle || titles[type],
    value: formattedValue,
    change: change ? { ...change, period } : undefined,
    gradient: getKpiGradient(type),
    tooltip: customTooltip || generateKpiTooltip(type, formattedValue, period)
  }
}

/**
 * Memoized KPI calculation hook
 */
export function useMemoizedKpiData(
  calculations: () => KpiData[],
  dependencies: React.DependencyList
): KpiData[] {
  return useMemoizedCalculation(calculations, dependencies)
}

/**
 * Batch KPI calculations for better performance
 */
export function calculateBatchKpis(
  data: Array<{ type: 'clients' | 'revenue' | 'health' | 'satisfaction' | 'conversion' | 'growth', value: number, previousValue?: number }>
): KpiData[] {
  return data.map(({ type, value, previousValue }) => 
    createKpiData(type, value, previousValue)
  )
}

/**
 * Optimized KPI value formatting with caching
 */
const formatCache = new Map<string, string>()

export function formatKpiValueCached(value: number, type: 'currency' | 'number' | 'percentage' = 'number'): string {
  const cacheKey = `${value}-${type}`
  
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!
  }
  
  const formatted = formatKpiValue(value, type)
  
  // Limit cache size
  if (formatCache.size > 1000) {
    const firstKey = formatCache.keys().next().value
    if (typeof firstKey === 'string') {
      formatCache.delete(firstKey)
    }
  }
  
  formatCache.set(cacheKey, formatted)
  return formatted
}

/**
 * Mock data generator for development
 */
export function generateMockKpiData(): KpiData[] {
  return [
    createKpiData('clients', 1234, 1098, 'last month'),
    createKpiData('revenue', 45678, 39542, 'last month'),
    createKpiData('health', 92, 94, 'last week'),
    createKpiData('satisfaction', 4.8, 4.6, 'this quarter'),
    createKpiData('conversion', 68, 60, 'this month'),
    createKpiData('growth', 15.7, 12.3, 'this quarter')
  ]
}