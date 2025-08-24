'use client'

import React, { useState } from 'react'
import { FilterState } from '@/types/domain'
import { cn } from '@/lib/utils'

interface FiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

const industries = [
  'Saloon',
  'Spa', 
  'Turf Club',
  'Clinics',
  'Laundry Shop',
  'Food Truck'
]

const statuses = ['Paid', 'Trial', 'Free Tier'] as const
const healthScores = ['Good', 'Warning', 'Critical'] as const

export function Filters({ filters, onFiltersChange, className }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleIndustryToggle = (industry: string) => {
    const newIndustries = filters.industries.includes(industry)
      ? filters.industries.filter(i => i !== industry)
      : [...filters.industries, industry]
    
    onFiltersChange({
      ...filters,
      industries: newIndustries
    })
  }

  const handleStatusToggle = (status: typeof statuses[number]) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter(s => s !== status)
      : [...filters.statuses, status]
    
    onFiltersChange({
      ...filters,
      statuses: newStatuses
    })
  }

  const handleHealthScoreToggle = (healthScore: typeof healthScores[number]) => {
    const newHealthScores = filters.healthScores.includes(healthScore)
      ? filters.healthScores.filter(h => h !== healthScore)
      : [...filters.healthScores, healthScore]
    
    onFiltersChange({
      ...filters,
      healthScores: newHealthScores
    })
  }

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    })
  }

  const handleReset = () => {
    onFiltersChange({
      search: '',
      industries: [],
      statuses: [],
      healthScores: [],
      dateRange: {
        start: '',
        end: ''
      }
    })
  }

  const hasActiveFilters = 
    filters.industries.length > 0 ||
    filters.statuses.length > 0 ||
    filters.healthScores.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {[
                filters.industries.length,
                filters.statuses.length,
                filters.healthScores.length,
                filters.dateRange.start || filters.dateRange.end ? 1 : 0
              ].reduce((a, b) => a + b, 0)} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <svg 
              className={cn('w-5 h-5 transition-transform', isExpanded ? 'rotate-180' : '')} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 space-y-6">
          {/* Date Range Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Industry Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => {
                const isSelected = filters.industries.includes(industry)
                return (
                  <button
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                      'border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      isSelected
                        ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                    )}
                  >
                    {industry}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Subscription Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const isSelected = filters.statuses.includes(status)
                const colorClasses = {
                  'Paid': isSelected 
                    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-green-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600',
                  'Trial': isSelected
                    ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600',
                  'Free Tier': isSelected
                    ? 'bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }
                
                return (
                  <button
                    key={status}
                    onClick={() => handleStatusToggle(status)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                      'border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      colorClasses[status]
                    )}
                  >
                    {status}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Health Score Filter */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Health Score
            </label>
            <div className="flex flex-wrap gap-2">
              {healthScores.map((healthScore) => {
                const isSelected = filters.healthScores.includes(healthScore)
                const colorClasses = {
                  'Good': isSelected
                    ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-green-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600',
                  'Warning': isSelected
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-yellow-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600',
                  'Critical': isSelected
                    ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-red-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }
                
                return (
                  <button
                    key={healthScore}
                    onClick={() => handleHealthScoreToggle(healthScore)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                      'border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                      colorClasses[healthScore]
                    )}
                  >
                    <div className="flex items-center space-x-1">
                      <div className={cn(
                        'w-2 h-2 rounded-full',
                        healthScore === 'Good' ? 'bg-green-500' :
                        healthScore === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                      )} />
                      <span>{healthScore}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Date Presets */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Quick Date Ranges
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Last 7 days', days: 7 },
                { label: 'Last 30 days', days: 30 },
                { label: 'Last 90 days', days: 90 },
                { label: 'This year', days: 365 }
              ].map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => {
                    const end = new Date().toISOString().split('T')[0]
                    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    onFiltersChange({
                      ...filters,
                      dateRange: { start, end }
                    })
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}