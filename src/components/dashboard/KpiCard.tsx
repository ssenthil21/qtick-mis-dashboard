'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface KpiCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period?: string
  }
  gradient: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'pink'
  tooltip?: string
  icon?: React.ReactNode
  className?: string
  onClick?: () => void
}

const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({ title, value, change, gradient, tooltip, icon, className, onClick, ...props }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false)

    const colorClasses = {
      blue: 'gradient-blue',
      green: 'gradient-green', 
      purple: 'gradient-purple',
      orange: 'gradient-orange',
      teal: 'gradient-teal',
      pink: 'gradient-pink'
    }

    const changeIcon = change?.type === 'increase' ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
      </svg>
    )

    const formatValue = (val: string | number): string => {
      if (typeof val === 'number') {
        if (val >= 1000000) {
          return `${(val / 1000000).toFixed(1)}M`
        } else if (val >= 1000) {
          return `${(val / 1000).toFixed(1)}K`
        }
        return val.toLocaleString()
      }
      return val
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-xl p-6 text-white shadow-lg transition-all duration-300 ease-out',
          'hover:scale-105 hover:shadow-xl hover:-translate-y-1',
          'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent',
          'cursor-pointer select-none border border-white/10',
          colorClasses[gradient],
          className
        )}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : 'article'}
        aria-label={`${title}: ${value}${change ? `, ${change.type} by ${Math.abs(change.value)}%` : ''}`}
        {...props}
      >
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        
        {/* Subtle pattern overlay for depth */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon and title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {icon && (
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white/25 rounded-lg backdrop-blur-sm shadow-sm">
                  {icon}
                </div>
              )}
              <h3 className="text-sm font-medium text-white/90 truncate">
                {title}
              </h3>
            </div>
            
            {/* Change indicator */}
            {change && (
              <div className={cn(
                'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
                change.type === 'increase' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/20 text-white/90'
              )}>
                {changeIcon}
                <span>{Math.abs(change.value)}%</span>
              </div>
            )}
          </div>

          {/* Value */}
          <div className="mb-2">
            <div className="text-3xl font-bold text-white leading-none">
              {formatValue(value)}
            </div>
            {change?.period && (
              <div className="text-xs text-white/70 mt-1">
                vs {change.period}
              </div>
            )}
          </div>

          {/* Progress bar (optional visual element) */}
          <div className="w-full bg-white/25 rounded-full h-1.5 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-white/60 rounded-full transition-all duration-1000 ease-out animate-pulse-slow shadow-sm"
              style={{ width: '75%' }}
            />
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
            <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg py-2 px-3 shadow-lg max-w-xs">
              <div className="text-center">{tooltip}</div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
              </div>
            </div>
          </div>
        )}

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    )
  }
)

KpiCard.displayName = 'KpiCard'

export { KpiCard }

// Skeleton loading component for KPI cards
export const KpiCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      'rounded-xl p-6 bg-gray-200 dark:bg-gray-800 animate-pulse',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24" />
        </div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-12" />
      </div>
      <div className="mb-2">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-1" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-16" />
      </div>
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1" />
    </div>
  )
}