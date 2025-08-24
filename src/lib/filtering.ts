import { useMemo } from 'react'
import { Client, FilterState } from '@/types/domain'
import { useMemoizedFilter, useMemoizedSort, useDebouncedCallback } from './performance'

// Cache for expensive calculations
const filterCache = new Map<string, Client[]>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes
const MAX_CACHE_SIZE = 100

// Health score mapping function
function getHealthScoreCategory(healthScore: number): 'Good' | 'Warning' | 'Critical' {
  if (healthScore >= 80) return 'Good'
  if (healthScore >= 60) return 'Warning'
  return 'Critical'
}

// Optimized search filtering with early termination
function searchClients(clients: Client[], searchTerm: string): Client[] {
  if (!searchTerm.trim()) return clients
  
  const normalizedSearch = searchTerm.toLowerCase().trim()
  const results: Client[] = []
  
  // Use for loop for better performance than filter
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i]
    const name = client.name.toLowerCase()
    const id = client.id.toLowerCase()
    const email = client.contactEmail?.toLowerCase() || ''
    const industry = client.industry.toLowerCase()
    
    if (name.includes(normalizedSearch) || 
        id.includes(normalizedSearch) || 
        email.includes(normalizedSearch) || 
        industry.includes(normalizedSearch)) {
      results.push(client)
    }
  }
  
  return results
}

// Debounced search hook for performance
export function useDebouncedSearch(
  callback: (searchTerm: string) => void,
  delay: number = 150
) {
  return useDebouncedCallback(callback, delay)
}

// Optimized filter application with caching and early returns
function applyFilters(clients: Client[], filters: FilterState): Client[] {
  if (!clients || clients.length === 0) return []
  
  // Create cache key
  const cacheKey = JSON.stringify({
    clientsLength: clients.length,
    search: filters.search,
    industries: filters.industries.sort(),
    statuses: filters.statuses.sort(),
    healthScores: filters.healthScores.sort(),
    dateRange: filters.dateRange
  })
  
  // Check cache
  const cached = filterCache.get(cacheKey)
  if (cached) {
    return cached
  }
  
  const results: Client[] = []
  
  // Pre-compute date range values if needed
  let startDate: Date | null = null
  let endDate: Date | null = null
  if (filters.dateRange.start || filters.dateRange.end) {
    startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null
    endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null
  }
  
  // Pre-compute search term
  const searchTerm = filters.search.trim().toLowerCase()
  
  // Single pass filtering for better performance
  for (let i = 0; i < clients.length; i++) {
    const client = clients[i]
    
    // Search filter (most selective, check first)
    if (searchTerm) {
      const name = client.name.toLowerCase()
      const id = client.id.toLowerCase()
      const email = client.contactEmail?.toLowerCase() || ''
      const industry = client.industry.toLowerCase()
      
      if (!name.includes(searchTerm) && 
          !id.includes(searchTerm) && 
          !email.includes(searchTerm) && 
          !industry.includes(searchTerm)) {
        continue
      }
    }

    // Industry filter
    if (filters.industries.length > 0 && !filters.industries.includes(client.industry)) {
      continue
    }

    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(client.status)) {
      continue
    }

    // Health score filter
    if (filters.healthScores.length > 0) {
      const healthCategory = getHealthScoreCategory(client.healthScore)
      if (!filters.healthScores.includes(healthCategory)) {
        continue
      }
    }

    // Date range filter
    if (startDate || endDate) {
      const clientDate = new Date(client.joinDate)
      if (startDate && clientDate < startDate) continue
      if (endDate && clientDate > endDate) continue
    }

    results.push(client)
  }
  
  // Cache the result
  if (filterCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = filterCache.keys().next().value
    if (typeof firstKey === 'string') {
      filterCache.delete(firstKey)
    }
  }
  filterCache.set(cacheKey, results)
  
  // Clean up expired cache entries periodically
  if (Math.random() < 0.1) { // 10% chance to clean up
    const now = Date.now()
    for (const [key] of filterCache.entries()) {
      // Simple cleanup - remove entries older than TTL
      // In a real implementation, you'd store timestamps
      if (filterCache.size > MAX_CACHE_SIZE / 2) {
        filterCache.delete(key)
        break
      }
    }
  }
  
  return results
}

// Date range multiplier calculations for KPI updates
function calculateDateRangeMultiplier(dateRange: { start: string; end: string }): number {
  if (!dateRange.start || !dateRange.end) return 1

  const start = new Date(dateRange.start)
  const end = new Date(dateRange.end)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Base multiplier on 30-day period
  const baselineDays = 30
  return diffDays / baselineDays
}

// Get quick date range presets
function getDateRangePreset(preset: 'last7days' | 'last30days' | 'last90days' | 'thisyear'): { start: string; end: string } {
  const end = new Date()
  const start = new Date()

  switch (preset) {
    case 'last7days':
      start.setDate(end.getDate() - 7)
      break
    case 'last30days':
      start.setDate(end.getDate() - 30)
      break
    case 'last90days':
      start.setDate(end.getDate() - 90)
      break
    case 'thisyear':
      start.setMonth(0, 1) // January 1st
      break
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0]
  }
}

// Calculate filtered KPI metrics
function calculateFilteredKPIs(clients: Client[], filters: FilterState) {
  const filteredClients = applyFilters(clients, filters)
  const multiplier = calculateDateRangeMultiplier(filters.dateRange)

  const totalClients = filteredClients.length
  const activeSubscriptions = filteredClients.filter(c => c.status === 'Paid').length
  const totalRevenue = filteredClients.reduce((sum, client) => sum + client.totalRevenue, 0) * multiplier
  const averageHealthScore = filteredClients.length > 0 
    ? filteredClients.reduce((sum, client) => sum + client.healthScore, 0) / filteredClients.length
    : 0

  // Calculate monthly jobs (assuming this is affected by date range)
  const monthlyJobs = filteredClients.reduce((sum, client) => sum + client.monthlyJobs, 0) * multiplier

  return {
    totalClients,
    activeSubscriptions,
    totalRevenue,
    averageHealthScore,
    monthlyJobs,
    filteredClients
  }
}

// Memoized filtering hook to prevent performance issues
function useFilteredClients(clients: Client[], filters: FilterState) {
  return useMemoizedFilter(
    clients,
    (client) => {
      // Search filter
      if (filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase()
        const name = client.name.toLowerCase()
        const id = client.id.toLowerCase()
        const email = client.contactEmail?.toLowerCase() || ''
        const industry = client.industry.toLowerCase()
        
        if (!name.includes(searchTerm) && 
            !id.includes(searchTerm) && 
            !email.includes(searchTerm) && 
            !industry.includes(searchTerm)) {
          return false
        }
      }

      // Industry filter
      if (filters.industries.length > 0 && !filters.industries.includes(client.industry)) {
        return false
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(client.status)) {
        return false
      }

      // Health score filter
      if (filters.healthScores.length > 0) {
        const healthCategory = getHealthScoreCategory(client.healthScore)
        if (!filters.healthScores.includes(healthCategory)) {
          return false
        }
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const clientDate = new Date(client.joinDate)
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null

        if (startDate && clientDate < startDate) return false
        if (endDate && clientDate > endDate) return false
      }

      return true
    },
    [filters.search, filters.industries, filters.statuses, filters.healthScores, filters.dateRange]
  )
}

// Memoized KPI calculations
function useFilteredKPIs(clients: Client[], filters: FilterState) {
  return useMemo(() => {
    return calculateFilteredKPIs(clients, filters)
  }, [clients, filters])
}

// Advanced search with fuzzy matching
function fuzzySearchClients(clients: Client[], searchTerm: string, threshold = 0.6): Client[] {
  if (!searchTerm.trim()) return clients

  const normalizedSearch = searchTerm.toLowerCase().trim()
  
  return clients.filter(client => {
    const searchableFields = [
      client.name,
      client.id,
      client.industry,
      client.contactEmail || '',
      client.phoneNumber || ''
    ].map(field => field.toLowerCase())

    // Simple fuzzy matching - check if search term appears in any field
    return searchableFields.some(field => {
      if (field.includes(normalizedSearch)) return true
      
      // Check for partial matches (at least 60% of search term matches)
      const words = normalizedSearch.split(' ')
      const matchingWords = words.filter(word => field.includes(word))
      return matchingWords.length / words.length >= threshold
    })
  })
}

// Optimized sorting with memoization
function sortClients(
  clients: Client[], 
  sortKey: keyof Client | 'healthScore', 
  direction: 'asc' | 'desc' = 'asc'
): Client[] {
  if (!clients || clients.length === 0) return []
  
  return [...clients].sort((a, b) => {
    let aValue: any
    let bValue: any

    if (sortKey === 'healthScore') {
      aValue = a.healthScore
      bValue = b.healthScore
    } else {
      aValue = a[sortKey]
      bValue = b[sortKey]
    }

    // Handle different data types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })
}

// Memoized sorting hook
export function useMemoizedSorting(
  clients: Client[],
  sortKey: keyof Client | 'healthScore',
  direction: 'asc' | 'desc' = 'asc'
): Client[] {
  return useMemoizedSort(
    clients,
    (a, b) => {
      let aValue: any
      let bValue: any

      if (sortKey === 'healthScore') {
        aValue = a.healthScore
        bValue = b.healthScore
      } else {
        aValue = a[sortKey]
        bValue = b[sortKey]
      }

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1
      if (aValue > bValue) return direction === 'asc' ? 1 : -1
      return 0
    },
    [sortKey, direction]
  )
}

// Get filter summary for display
function getFilterSummary(filters: FilterState): string {
  const parts: string[] = []

  if (filters.search.trim()) {
    parts.push(`Search: "${filters.search}"`)
  }

  if (filters.industries.length > 0) {
    parts.push(`Industries: ${filters.industries.length}`)
  }

  if (filters.statuses.length > 0) {
    parts.push(`Status: ${filters.statuses.length}`)
  }

  if (filters.healthScores.length > 0) {
    parts.push(`Health: ${filters.healthScores.length}`)
  }

  if (filters.dateRange.start || filters.dateRange.end) {
    parts.push('Date Range')
  }

  return parts.length > 0 ? parts.join(', ') : 'No filters applied'
}

// Validate filter state
function validateFilters(filters: FilterState): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validate date range
  if (filters.dateRange.start && filters.dateRange.end) {
    const start = new Date(filters.dateRange.start)
    const end = new Date(filters.dateRange.end)
    
    if (start > end) {
      errors.push('Start date must be before end date')
    }
    
    if (start > new Date()) {
      errors.push('Start date cannot be in the future')
    }
  }

  // Validate search term length
  if (filters.search.length > 100) {
    errors.push('Search term is too long (max 100 characters)')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// Export all utilities
export {
  getHealthScoreCategory,
  searchClients,
  applyFilters as filterClients,
  applyFilters,
  calculateDateRangeMultiplier,
  getDateRangePreset,
  calculateFilteredKPIs,
  useFilteredClients,
  useFilteredKPIs,
  fuzzySearchClients,
  sortClients,
  getFilterSummary,
  validateFilters
}