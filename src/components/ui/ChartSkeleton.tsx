'use client'

import { Skeleton } from './Skeleton'
import { cn } from '@/lib/utils'

interface ChartSkeletonProps {
  className?: string
  height?: string
  showLegend?: boolean
  showTitle?: boolean
}

/**
 * Base chart skeleton component
 */
export function ChartSkeleton({ 
  className, 
  height = 'h-64', 
  showLegend = false, 
  showTitle = false 
}: ChartSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
      )}
      
      <div className="relative">
        <Skeleton className={cn('w-full rounded-lg', height)} />
        
        {/* Chart elements overlay */}
        <div className="absolute inset-4 flex items-end justify-between">
          {/* Simulated bars/data points */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton 
                className={cn(
                  'w-8 bg-gray-300 dark:bg-gray-600',
                  `h-${Math.floor(Math.random() * 20) + 8}`
                )} 
              />
              <Skeleton className="h-3 w-6" />
            </div>
          ))}
        </div>
      </div>
      
      {showLegend && (
        <div className="mt-4 flex justify-center space-x-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Bar chart skeleton
 */
export function BarChartSkeleton({ className, showTitle = true }: ChartSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
      )}
      
      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-64">
        {/* Y-axis labels */}
        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
        
        {/* Bars */}
        <div className="ml-12 mr-4 h-full flex items-end justify-between pb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 flex-1 mx-1">
              <Skeleton 
                className={cn(
                  'w-full bg-blue-200 dark:bg-blue-800',
                  `h-${[16, 24, 20, 32, 12, 28][i] || 20}`
                )} 
              />
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-2 left-12 right-4 flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Pie/Doughnut chart skeleton
 */
export function PieChartSkeleton({ className, showTitle = true, showLegend = true }: ChartSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="mb-4 text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      )}
      
      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-6 h-64 flex items-center justify-center">
        {/* Pie chart circle */}
        <div className="relative">
          <Skeleton className="h-32 w-32 rounded-full" />
          
          {/* Pie segments overlay */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="h-full w-full relative">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-800 rounded-full" 
                   style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }} />
              <div className="absolute inset-0 bg-green-200 dark:bg-green-800 rounded-full" 
                   style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
              <div className="absolute inset-0 bg-yellow-200 dark:bg-yellow-800 rounded-full" 
                   style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 0%, 50% 0%)' }} />
            </div>
          </div>
        </div>
      </div>
      
      {showLegend && (
        <div className="mt-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-12 ml-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Radar chart skeleton
 */
export function RadarChartSkeleton({ className, showTitle = true, showLegend = true }: ChartSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="mb-4 text-center">
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      )}
      
      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-6 h-64 flex items-center justify-center">
        {/* Radar chart hexagon */}
        <div className="relative">
          <Skeleton className="h-40 w-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
          
          {/* Radar lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-32 w-32">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-0.5 w-16 bg-gray-300 dark:bg-gray-600 origin-left"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg)`,
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Data points */}
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="absolute h-2 w-2 rounded-full bg-blue-300 dark:bg-blue-700"
              style={{
                top: `${50 + Math.cos((i * 60 - 90) * Math.PI / 180) * (20 + Math.random() * 15)}%`,
                left: `${50 + Math.sin((i * 60 - 90) * Math.PI / 180) * (20 + Math.random() * 15)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      </div>
      
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Line chart skeleton
 */
export function LineChartSkeleton({ className, showTitle = true }: ChartSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {showTitle && (
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
      )}
      
      <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 h-64">
        {/* Y-axis labels */}
        <div className="absolute left-2 top-4 bottom-8 flex flex-col justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
        
        {/* Line chart area */}
        <div className="ml-12 mr-4 h-full pb-8 relative">
          {/* Grid lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full border-t border-gray-200 dark:border-gray-700"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
          
          {/* Data line */}
          <svg className="absolute inset-0 w-full h-full">
            <path
              d="M 0,80 Q 60,40 120,60 T 240,30 T 360,70"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-blue-400 dark:text-blue-500"
            />
            {/* Data points */}
            {[0, 120, 240, 360].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={[80, 60, 30, 70][i]}
                r="3"
                className="fill-blue-500 dark:fill-blue-400"
              />
            ))}
          </svg>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-2 left-12 right-4 flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}