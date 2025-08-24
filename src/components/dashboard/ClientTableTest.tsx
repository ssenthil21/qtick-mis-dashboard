'use client'

import { useState } from 'react'
import { ClientTable } from './ClientTable'
import { sampleClients } from '@/lib/seed'
import { Client, FilterState, SortConfig } from '@/types/domain'
// import { applyFilters, sortClients } from '@/lib/filtering'

export function ClientTableTest() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  })
  const [filters] = useState<FilterState>({
    search: '',
    industries: [],
    statuses: [],
    healthScores: [],
    dateRange: {
      start: '',
      end: ''
    }
  })

  const handleSort = (key: keyof Client) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    console.log('Selected client:', client)
  }

  // Apply filters and sorting - simplified for testing
  const filteredClients = sampleClients
  const sortedClients = filteredClients

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Client Table Test</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Testing the ClientTable component with sorting functionality
        </p>
      </div>

      <ClientTable
        clients={sortedClients}
        onClientSelect={handleClientSelect}
        searchTerm={filters.search}
        filters={filters}
        sortConfig={sortConfig}
        onSort={handleSort}
        loading={false}
      />

      {selectedClient && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Selected Client
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p><strong>Name:</strong> {selectedClient.name}</p>
            <p><strong>Industry:</strong> {selectedClient.industry}</p>
            <p><strong>Status:</strong> {selectedClient.status}</p>
            <p><strong>Health Score:</strong> {selectedClient.healthScore}</p>
            <p><strong>Monthly Jobs:</strong> {selectedClient.monthlyJobs}</p>
            <p><strong>Revenue:</strong> ${selectedClient.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  )
}