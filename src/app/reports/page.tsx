'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Report {
  id: string
  name: string
  type: 'revenue' | 'clients' | 'performance' | 'custom'
  dateRange: string
  createdAt: Date
  status: 'completed' | 'processing' | 'failed'
  size: string
  format: 'pdf' | 'excel' | 'csv'
}

interface ReportConfig {
  name: string
  type: 'revenue' | 'clients' | 'performance' | 'custom'
  dateRange: 'last-7-days' | 'last-30-days' | 'last-90-days' | 'ytd' | 'custom'
  customDateStart: string
  customDateEnd: string
  format: 'pdf' | 'excel' | 'csv'
  includeCharts: boolean
  includeDetails: boolean
  filters: {
    industries: string[]
    statuses: string[]
  }
}

const recentReports: Report[] = [
  {
    id: '1',
    name: 'Monthly Revenue Analysis',
    type: 'revenue',
    dateRange: 'Last 30 days',
    createdAt: new Date('2024-01-15T10:30:00'),
    status: 'completed',
    size: '2.4 MB',
    format: 'pdf'
  },
  {
    id: '2',
    name: 'Client Performance Report',
    type: 'performance',
    dateRange: 'Q4 2023',
    createdAt: new Date('2024-01-12T14:15:00'),
    status: 'completed',
    size: '1.8 MB',
    format: 'excel'
  },
  {
    id: '3',
    name: 'Salon Industry Analysis',
    type: 'clients',
    dateRange: 'Last 90 days',
    createdAt: new Date('2024-01-10T09:45:00'),
    status: 'processing',
    size: '-',
    format: 'pdf'
  },
  {
    id: '4',
    name: 'Custom KPI Dashboard',
    type: 'custom',
    dateRange: 'YTD 2024',
    createdAt: new Date('2024-01-08T16:20:00'),
    status: 'completed',
    size: '3.1 MB',
    format: 'csv'
  },
  {
    id: '5',
    name: 'Weekly Summary Report',
    type: 'revenue',
    dateRange: 'Last 7 days',
    createdAt: new Date('2024-01-05T11:00:00'),
    status: 'failed',
    size: '-',
    format: 'pdf'
  }
]

const reportTypes = [
  { value: 'revenue', label: 'Revenue Analysis', description: 'Financial performance and revenue trends' },
  { value: 'clients', label: 'Client Analytics', description: 'Client behavior and segmentation analysis' },
  { value: 'performance', label: 'Performance Metrics', description: 'KPI tracking and performance indicators' },
  { value: 'custom', label: 'Custom Report', description: 'Build your own custom analytics report' }
]

const dateRanges = [
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'last-30-days', label: 'Last 30 days' },
  { value: 'last-90-days', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
  { value: 'custom', label: 'Custom range' }
]

const industries = ['Saloon', 'Spa', 'Turf Club', 'Clinics', 'Laundry Shop', 'Food Truck']
const statuses = ['Paid', 'Trial', 'Free Tier']

function getReportTypeIcon(type: Report['type']) {
  switch (type) {
    case 'revenue':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    case 'clients':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    case 'performance':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'custom':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
  }
}

function getStatusBadge(status: Report['status']) {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
          Completed
        </span>
      )
    case 'processing':
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
          Processing
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span>
          Failed
        </span>
      )
  }
}

export default function ReportsPage() {
  const [config, setConfig] = useState<ReportConfig>({
    name: '',
    type: 'revenue',
    dateRange: 'last-30-days',
    customDateStart: '',
    customDateEnd: '',
    format: 'pdf',
    includeCharts: true,
    includeDetails: false,
    filters: {
      industries: [],
      statuses: []
    }
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = () => {
    if (!config.name.trim()) {
      alert('Please enter a report name')
      return
    }

    setIsGenerating(true)
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      alert('Report generation started! You will be notified when it\'s ready.')
      
      // Reset form
      setConfig({
        name: '',
        type: 'revenue',
        dateRange: 'last-30-days',
        customDateStart: '',
        customDateEnd: '',
        format: 'pdf',
        includeCharts: true,
        includeDetails: false,
        filters: {
          industries: [],
          statuses: []
        }
      })
    }, 2000)
  }

  const handleIndustryToggle = (industry: string) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        industries: prev.filters.industries.includes(industry)
          ? prev.filters.industries.filter(i => i !== industry)
          : [...prev.filters.industries, industry]
      }
    }))
  }

  const handleStatusToggle = (status: string) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        statuses: prev.filters.statuses.includes(status)
          ? prev.filters.statuses.filter(s => s !== status)
          : [...prev.filters.statuses, status]
      }
    }))
  }

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Builder */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Report Builder</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Configure and generate custom analytics reports
                  </p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Report Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Report Name
                    </label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter report name..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Report Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Report Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {reportTypes.map((type) => (
                        <div
                          key={type.value}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            config.type === type.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                          onClick={() => setConfig(prev => ({ ...prev, type: type.value as any }))}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              config.type === type.value
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {getReportTypeIcon(type.value as any)}
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                {type.label}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <select
                      value={config.dateRange}
                      onChange={(e) => setConfig(prev => ({ ...prev, dateRange: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {dateRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Date Range */}
                  {config.dateRange === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={config.customDateStart}
                          onChange={(e) => setConfig(prev => ({ ...prev, customDateStart: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={config.customDateEnd}
                          onChange={(e) => setConfig(prev => ({ ...prev, customDateEnd: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Format and Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Export Format
                      </label>
                      <select
                        value={config.format}
                        onChange={(e) => setConfig(prev => ({ ...prev, format: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="csv">CSV File</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={config.includeCharts}
                            onChange={(e) => setConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include charts</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={config.includeDetails}
                            onChange={(e) => setConfig(prev => ({ ...prev, includeDetails: e.target.checked }))}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Include detailed data</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filters (Optional)
                    </label>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industries</h4>
                        <div className="flex flex-wrap gap-2">
                          {industries.map((industry) => (
                            <button
                              key={industry}
                              onClick={() => handleIndustryToggle(industry)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                config.filters.industries.includes(industry)
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {industry}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {statuses.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusToggle(status)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                config.filters.statuses.includes(status)
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGenerating || !config.name.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Generating Report...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Generate Report</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Reports</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your generated reports history
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentReports.map((report) => (
                    <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          {getReportTypeIcon(report.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {report.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {report.dateRange} • {report.format.toUpperCase()}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(report.status)}
                              {report.status === 'completed' && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {report.size}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {report.createdAt.toLocaleDateString()} at {report.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {report.status === 'completed' && (
                          <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    View All Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}