'use client'

// import { useState } from 'react'
import { Client, FilterState, SortConfig } from '@/types/domain'
import { HealthBadge, StatusBadge } from '@/components/ui/Badge'
// Inline health score calculation to avoid import issues
const getHealthScoreCategory = (healthScore: number): 'Good' | 'Warning' | 'Critical' => {
  if (healthScore >= 80) return 'Good'
  if (healthScore >= 60) return 'Warning'
  return 'Critical'
}

interface ClientTableProps {
  clients: Client[]
  onClientSelect: (client: Client) => void
  searchTerm: string
  filters: FilterState
  sortConfig: SortConfig
  onSort: (key: keyof Client) => void
  loading?: boolean
}

interface TableSkeletonProps {
  rows?: number
}

function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </td>
        </tr>
      ))}
    </>
  )
}

export function ClientTable({
  clients,
  onClientSelect,
  searchTerm: _searchTerm,
  filters: _filters,
  sortConfig,
  onSort,
  loading = false
}: ClientTableProps) {
  const getSortIcon = (columnKey: keyof Client) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    
    if (sortConfig.direction === 'asc') {
      return (
        <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )
    }
    
    return (
      <svg className="w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (dateString === 'N/A') return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getHealthBadge = (client: Client) => {
    const healthCategory = getHealthScoreCategory(client.healthScore)
    const scoreMap = {
      'Good': 'Green' as const,
      'Warning': 'Yellow' as const,
      'Critical': 'Red' as const
    }
    
    return (
      <HealthBadge score={scoreMap[healthCategory]} />
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center">
                  Client Name
                  {getSortIcon('name')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('industry')}
              >
                <div className="flex items-center">
                  Industry
                  {getSortIcon('industry')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Health
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('monthlyJobs')}
              >
                <div className="flex items-center">
                  Monthly Jobs
                  {getSortIcon('monthlyJobs')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('totalRevenue')}
              >
                <div className="flex items-center">
                  Revenue
                  {getSortIcon('totalRevenue')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('lastActivity')}
              >
                <div className="flex items-center">
                  Last Activity
                  {getSortIcon('lastActivity')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('joinDate')}
              >
                <div className="flex items-center">
                  Join Date
                  {getSortIcon('joinDate')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => onSort('subscriptionEndDate')}
              >
                <div className="flex items-center">
                  Subscription End
                  {getSortIcon('subscriptionEndDate')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <TableSkeleton rows={8} />
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No clients found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => onClientSelect(client)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {client.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {client.industry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={client.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getHealthBadge(client)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {client.monthlyJobs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(client.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(client.lastActivity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(client.joinDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(client.subscriptionEndDate)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}