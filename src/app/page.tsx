'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Filters } from '@/components/dashboard/Filters'
import { ClientTable } from '@/components/dashboard/ClientTable'
import { ClientDeepDive } from '@/components/dashboard/ClientDeepDive'
import { useToast } from '@/components/ui/Toaster'

import { FilterState } from '@/types/domain'
import { useFilteredClients, useFilteredKPIs } from '@/lib/filtering'
import { sampleClients } from '@/lib/seed'
import { Client, SortConfig } from '@/types/domain'

export default function Home() {
  const { theme, setTheme } = useTheme()
  const { success, error, warning, info } = useToast()
  const [mounted, setMounted] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    industries: [],
    statuses: [],
    healthScores: [],
    dateRange: {
      start: '',
      end: ''
    }
  })
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  })
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setFilters(prev => ({ ...prev, search: value }))
    // In a real app, this would filter the client data
    console.log('Search term:', value)
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    console.log('Filters changed:', newFilters)
  }

  const handleSort = (key: keyof Client) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    // Scroll to client details section
    const detailsSection = document.getElementById('client-details')
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Use the filtering utilities
  const filteredClients = useFilteredClients(sampleClients, filters)
  const filteredKPIs = useFilteredKPIs(sampleClients, filters)

  // Apply sorting to filtered clients when a sort key is set
  const sortedClients = sortConfig.key
    ? [...filteredClients].sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue)
          return sortConfig.direction === 'asc' ? comparison : -comparison
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue
          return sortConfig.direction === 'asc' ? comparison : -comparison
        }

        return 0
      })
    : filteredClients

  if (!mounted) {
    return null
  }

  return (
    <DashboardLayout 
      showSearch={true}
      onSearchChange={handleSearchChange}
      searchValue={searchTerm}
    >
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

        

        
        {/* Filters Component */}
        <div className="mt-8 mb-8">
          <Filters 
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Active Filters Summary */}
        {(filters.industries.length > 0 || filters.statuses.length > 0 || filters.healthScores.length > 0 || filters.dateRange.start || filters.dateRange.end) && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {filters.industries.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                  Industries: {filters.industries.join(', ')}
                </span>
              )}
              {filters.statuses.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                  Status: {filters.statuses.join(', ')}
                </span>
              )}
              {filters.healthScores.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                  Health: {filters.healthScores.join(', ')}
                </span>
              )}
              {(filters.dateRange.start || filters.dateRange.end) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200">
                  Date: {filters.dateRange.start || 'Start'} - {filters.dateRange.end || 'End'}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <KpiCard
            title="Total Clients"
            value={filteredKPIs.totalClients}
            gradient="teal"
            change={{ value: 12.5, type: 'increase', period: 'filtered results' }}
            tooltip={`Total number of clients matching current filters (${filteredKPIs.totalClients} of ${sampleClients.length})`}
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          
          <KpiCard
            title="Active Subscriptions"
            value={filteredKPIs.activeSubscriptions}
            gradient="blue"
            change={{ value: 8.3, type: 'increase', period: 'filtered results' }}
            tooltip={`Number of clients with active paid subscriptions in filtered results`}
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          
          <KpiCard
            title="Total Revenue"
            value={`₹${filteredKPIs.totalRevenue.toLocaleString()}`}
            gradient="green"
            change={{ value: 15.7, type: 'increase', period: 'filtered results' }}
            tooltip={`Total revenue from filtered clients (affected by date range multiplier)`}
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          
          <KpiCard
            title="Avg Health Score"
            value={`${Math.round(filteredKPIs.averageHealthScore)}%`}
            gradient="purple"
            change={{ value: 2.1, type: 'decrease', period: 'filtered results' }}
            tooltip={`Average health score across filtered clients based on activity and engagement`}
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
        </div>
        
        {/* Additional KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <KpiCard
            title="New Clients"
            value={sampleClients.filter(client => client.newCustomer).length}
            gradient="orange"
            change={{ value: 25.3, type: 'increase', period: 'this month' }}
            tooltip="Number of new clients acquired this month"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            }
          />
          
          <KpiCard
            title="Churn Rate"
            value="3.2%"
            gradient="pink"
            change={{ value: 1.5, type: 'decrease', period: 'vs last month' }}
            tooltip="Percentage of clients who cancelled their subscription this month"
            icon={
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            }
          />
        </div>
        
        {/* Client Table */}
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Client Management ({sortedClients.length} of {sampleClients.length} clients)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click on any client row to view detailed information
            </p>
          </div>
          
          <ClientTable
            clients={sortedClients}
            onClientSelect={handleClientSelect}
            searchTerm={searchTerm}
            filters={filters}
            sortConfig={sortConfig}
            onSort={handleSort}
            loading={false}
          />
        </div>

        {/* Client Deep Dive Section */}
        {selectedClient && (
          <div className="mt-8">
            <ClientDeepDive 
              client={selectedClient} 
              onClose={() => setSelectedClient(null)} 
            />
          </div>
        )}
        

        </div>
      </div>
    </DashboardLayout>
  )
}