'use client'

import { Skeleton, SkeletonText, SkeletonCircle } from './Skeleton'
import { TableSkeleton, KpiSkeleton, ClientDeepDiveSkeleton } from './TableSkeleton'
import { BarChartSkeleton, PieChartSkeleton, RadarChartSkeleton, LineChartSkeleton } from './ChartSkeleton'
import { cn } from '@/lib/utils'

/**
 * Page loading skeleton for dashboard pages
 */
interface PageLoadingProps {
  showHeader?: boolean
  showKpis?: boolean
  showTable?: boolean
  showChart?: boolean
  className?: string
}

export function PageLoading({ 
  showHeader = true, 
  showKpis = true, 
  showTable = true, 
  showChart = false,
  className 
}: PageLoadingProps) {
  return (
    <div className={cn('space-y-8 p-6', className)}>
      {/* Page Header */}
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      )}

      {/* KPI Cards */}
      {showKpis && <KpiSkeleton />}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table */}
        {showTable && (
          <div className="lg:col-span-2">
            <TableSkeleton />
          </div>
        )}

        {/* Chart or sidebar */}
        {showChart && (
          <div className="lg:col-span-1">
            <BarChartSkeleton />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Analytics page loading skeleton
 */
export function AnalyticsLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8 p-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* KPI Cards */}
      <KpiSkeleton cards={3} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <PieChartSkeleton />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <BarChartSkeleton />
        </div>
      </div>

      {/* Benchmarking Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-10 w-full mb-4" />
            <KpiSkeleton cards={3} className="grid-cols-1" />
          </div>
          <RadarChartSkeleton />
        </div>
      </div>
    </div>
  )
}

/**
 * CRM page loading skeleton
 */
export function CrmLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8 p-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Segmentation KPIs */}
      <KpiSkeleton cards={3} />

      {/* Campaign Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <Skeleton className="h-6 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <Skeleton className="h-12 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <SkeletonCircle size="sm" />
              <div className="flex-1">
                <SkeletonText lines={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Live Ops loading skeleton
 */
export function LiveOpsLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8 p-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Activity Feed */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 flex items-start space-x-3">
              <SkeletonCircle size="sm" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <SkeletonText lines={1} className="w-1/2" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <SkeletonText lines={1} className="w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Reports page loading skeleton
 */
export function ReportsLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8 p-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Builder */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-48" />
              </div>
            ))}
          </div>
          <div className="mt-6 flex space-x-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Admin page loading skeleton
 */
export function AdminLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Users Table */}
      <TableSkeleton rows={8} columns={5} showActions />
    </div>
  )
}

/**
 * Modal loading skeleton
 */
export function ModalLoading({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Modal Header */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {/* Modal Actions */}
      <div className="flex justify-end space-x-3">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}