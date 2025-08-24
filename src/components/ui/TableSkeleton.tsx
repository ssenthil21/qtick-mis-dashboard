'use client'

import { Skeleton, SkeletonText, SkeletonCircle, SkeletonButton } from './Skeleton'
import { cn } from '@/lib/utils'

interface TableSkeletonProps {
  rows?: number
  columns?: number
  showHeader?: boolean
  showActions?: boolean
  className?: string
}

/**
 * Skeleton component for table loading states
 */
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  showHeader = true, 
  showActions = false,
  className 
}: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Table Header */}
        {showHeader && (
          <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {Array.from({ length: columns }).map((_, i) => (
                  <div key={i} className={cn('flex-1', i === 0 && 'max-w-xs')}>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
                {showActions && (
                  <div className="w-20">
                    <Skeleton className="h-4 w-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Table Body */}
        <div className="bg-white dark:bg-gray-900">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div 
              key={rowIndex} 
              className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <div key={colIndex} className={cn('flex-1', colIndex === 0 && 'max-w-xs')}>
                      {colIndex === 0 ? (
                        // First column - typically has more complex content
                        <div className="flex items-center space-x-3">
                          <SkeletonCircle size="sm" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      ) : colIndex === columns - 1 ? (
                        // Last column - typically status or badge
                        <div className="flex justify-end">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      ) : (
                        // Middle columns - simple text
                        <SkeletonText lines={1} />
                      )}
                    </div>
                  ))}
                  {showActions && (
                    <div className="w-20 flex justify-end">
                      <SkeletonButton size="sm" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton for KPI cards grid
 */
interface KpiSkeletonProps {
  cards?: number
  className?: string
}

export function KpiSkeleton({ cards = 4, className }: KpiSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <SkeletonText lines={1} className="w-1/2" />
            <SkeletonCircle size="sm" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton for client deep dive section
 */
export function ClientDeepDiveSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SkeletonCircle size="lg" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex space-x-2">
            <SkeletonButton />
            <SkeletonButton />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* KPI Cards */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <SkeletonText lines={1} className="w-1/2" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}