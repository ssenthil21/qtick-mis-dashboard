import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'health' | 'status'
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', color = 'gray', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-default'
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base'
    }
    
    const variantClasses = {
      default: {
        green: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30',
        yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30',
        red: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30',
        blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30',
        gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      },
      health: {
        green: 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/30',
        yellow: 'bg-yellow-100 text-yellow-700 border border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/30',
        red: 'bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/30',
        blue: 'bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30',
        gray: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
      },
      status: {
        green: 'bg-green-50 text-green-700 ring-1 ring-green-600/20 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-400 dark:ring-green-400/20 dark:hover:bg-green-900/20',
        yellow: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20 hover:bg-yellow-100 dark:bg-yellow-900/10 dark:text-yellow-400 dark:ring-yellow-400/20 dark:hover:bg-yellow-900/20',
        red: 'bg-red-50 text-red-700 ring-1 ring-red-600/20 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400 dark:ring-red-400/20 dark:hover:bg-red-900/20',
        blue: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 hover:bg-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:ring-blue-400/20 dark:hover:bg-blue-900/20',
        gray: 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 hover:bg-gray-100 dark:bg-gray-900/10 dark:text-gray-300 dark:ring-gray-400/20 dark:hover:bg-gray-900/20'
      }
    }

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant][color],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }

// Health Score Badge Component
export interface HealthBadgeProps extends Omit<BadgeProps, 'variant' | 'color' | 'children'> {
  score: 'Green' | 'Yellow' | 'Red'
  label?: string
}

export const HealthBadge = React.forwardRef<HTMLSpanElement, HealthBadgeProps>(
  ({ score, label, className, ...props }, ref) => {
    const colorMap = {
      Green: 'green' as const,
      Yellow: 'yellow' as const,
      Red: 'red' as const
    }
    
    const labelMap = {
      Green: 'Healthy',
      Yellow: 'At Risk',
      Red: 'Critical'
    }

    return (
      <Badge
        ref={ref}
        variant="health"
        color={colorMap[score]}
        className={className}
        aria-label={`Health status: ${label || labelMap[score]}`}
        {...props}
      >
        {label || labelMap[score]}
      </Badge>
    )
  }
)

HealthBadge.displayName = 'HealthBadge'

// Status Badge Component
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'color' | 'children'> {
  status: 'Paid' | 'Trial' | 'Free Tier'
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, className, ...props }, ref) => {
    const colorMap = {
      'Paid': 'green' as const,
      'Trial': 'blue' as const,
      'Free Tier': 'gray' as const
    }

    return (
      <Badge
        ref={ref}
        variant="status"
        color={colorMap[status]}
        className={className}
        aria-label={`Subscription status: ${status}`}
        {...props}
      >
        {status}
      </Badge>
    )
  }
)

StatusBadge.displayName = 'StatusBadge'