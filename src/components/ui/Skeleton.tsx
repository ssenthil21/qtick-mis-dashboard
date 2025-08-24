'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({ className, children, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
        'relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r',
        'before:from-transparent before:via-white/20 before:to-transparent',
        'dark:before:via-white/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Skeleton for text content
 */
interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 1, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton for circular elements like avatars
 */
interface SkeletonCircleProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function SkeletonCircle({ size = 'md', className }: SkeletonCircleProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
  )
}

/**
 * Skeleton for buttons
 */
interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SkeletonButton({ size = 'md', className }: SkeletonButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }

  return (
    <Skeleton className={cn('rounded-md', sizeClasses[size], className)} />
  )
}