'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { PieChart, BarChart, RadarChart, ChartErrorBoundary } from '@/components/charts'
import { sampleClients, industryAverages } from '@/lib/seed'
import { Client } from '@/types/domain'
import { ClientComparison } from '@/components/analytics/ClientComparison'

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedClientForBenchmark, setSelectedClientForBenchmark] = useState<Client | null>(null)

  useEffect(() => {
    setMounted(true)
    // Set first paid client as default for benchmarking
    const firstPaidClient = sampleClients.find(client => client.status === 'Paid')
    if (firstPaidClient) {
      setSelectedClientForBenchmark(firstPaidClient)
    }
  }, [])

  // Calculate revenue metrics
  const totalRevenue = sampleClients.reduce((sum, client) => sum + client.totalRevenue, 0)
  const paidClients = sampleClients.filter(client => client.status === 'Paid').length
  
  // ARPC (Average Revenue Per Client) - only for paid clients
  const arpc = paidClients > 0 ? totalRevenue / paidClients : 0
  
  // LTV (Lifetime Value) - simplified calculation based on monthly revenue and estimated lifetime
  const avgMonthlyRevenue = arpc / 12 // Assuming annual revenue
  const estimatedLifetimeMonths = 24 // 2 years average
  const ltv = avgMonthlyRevenue * estimatedLifetimeMonths

  // Revenue by industry data
  const revenueByIndustry = sampleClients.reduce((acc, client) => {
    if (!acc[client.industry]) {
      acc[client.industry] = 0
    }
    acc[client.industry] += client.totalRevenue
    return acc
  }, {} as Record<string, number>)

  const industryChartData = {
    labels: Object.keys(revenueByIndustry),
    datasets: [
      {
        data: Object.values(revenueByIndustry)
      }
    ]
  }

  // Feature adoption data - calculate from client features
  const featureAdoption = sampleClients.reduce((acc, client) => {
    client.features.forEach(feature => {
      if (!acc[feature.featureName]) {
        acc[feature.featureName] = {
          totalUsage: 0,
          clientCount: 0,
          totalAdoption: 0
        }
      }
      acc[feature.featureName].totalUsage += feature.usageCount
      acc[feature.featureName].clientCount += 1
      acc[feature.featureName].totalAdoption += feature.adoptionRate
    })
    return acc
  }, {} as Record<string, { totalUsage: number; clientCount: number; totalAdoption: number }>)

  const featureChartData = {
    labels: Object.keys(featureAdoption),
    datasets: [
      {
        label: 'Average Adoption Rate (%)',
        data: Object.values(featureAdoption).map(feature => 
          Math.round(feature.totalAdoption / feature.clientCount)
        )
      }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!mounted) {
    return (
      <DashboardLayout showSearch={false}>
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-8"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>

          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              gradient="green"
              change={{ value: 15.7, type: 'increase', period: 'vs last quarter' }}
              tooltip="Total revenue across all clients"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              }
            />
            
            <KpiCard
              title="ARPC"
              value={formatCurrency(arpc)}
              gradient="blue"
              change={{ value: 8.3, type: 'increase', period: 'vs last quarter' }}
              tooltip="Average Revenue Per Client (paid clients only)"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            <KpiCard
              title="LTV"
              value={formatCurrency(ltv)}
              gradient="purple"
              change={{ value: 12.1, type: 'increase', period: 'vs last quarter' }}
              tooltip="Customer Lifetime Value (estimated 24 months)"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            
            <KpiCard
              title="Revenue Growth"
              value="23.5%"
              gradient="orange"
              change={{ value: 5.2, type: 'increase', period: 'vs last quarter' }}
              tooltip="Quarterly revenue growth rate"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              }
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue by Industry Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Industry</h3>
              <ChartErrorBoundary>
                <PieChart
                  data={industryChartData}
                  className="h-80"
                />
              </ChartErrorBoundary>
            </div>

            {/* Feature Adoption Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Adoption Rates</h3>
              <ChartErrorBoundary>
                <BarChart
                  data={featureChartData}
                  className="h-80"
                />
              </ChartErrorBoundary>
            </div>
          </div>

          {/* Revenue Breakdown Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Breakdown by Industry</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Clients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Avg per Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(revenueByIndustry)
                    .sort(([,a], [,b]) => b - a)
                    .map(([industry, revenue]) => {
                      const clientsInIndustry = sampleClients.filter(c => c.industry === industry).length
                      const avgPerClient = revenue / clientsInIndustry
                      const percentage = ((revenue / totalRevenue) * 100).toFixed(1)
                      
                      return (
                        <tr key={industry} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {industry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {clientsInIndustry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatCurrency(avgPerClient)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {percentage}%
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Client Benchmarking Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Client Benchmarking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Compare individual client performance against industry averages
              </p>
              
              {/* Client Selector */}
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select Client:
                </label>
                <select
                  value={selectedClientForBenchmark?.id || ''}
                  onChange={(e) => {
                    const client = sampleClients.find(c => c.id === e.target.value)
                    setSelectedClientForBenchmark(client || null)
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a client...</option>
                  {sampleClients
                    .filter(client => client.status === 'Paid') // Only show paid clients for meaningful comparison
                    .map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name} ({client.industry})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {selectedClientForBenchmark && (
              <div className="transition-all duration-500 ease-in-out">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Benchmarking Metrics */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Performance vs Industry Average
                    </h4>
                    <div className="space-y-4">
                      {(() => {
                        // Calculate client metrics (using mock data since we don't have all fields)
                        const clientRetention = 85 + Math.floor(Math.random() * 15) // 85-100%
                        const clientReviews = 3.5 + Math.random() * 1.5 // 3.5-5.0
                        const clientJobGrowth = -10 + Math.random() * 40 // -10% to 30%
                        
                        // Get industry average (using a generic industry for demo)
                        const industryAvg = industryAverages.find(avg => avg.industry === 'Technology') || industryAverages[0]
                        
                        const metrics = [
                          {
                            label: 'Retention Rate',
                            client: clientRetention,
                            industry: industryAvg.averageRetention,
                            unit: '%',
                            format: (val: number) => `${val.toFixed(1)}%`
                          },
                          {
                            label: 'Average Reviews',
                            client: clientReviews,
                            industry: industryAvg.averageReviews,
                            unit: '/5',
                            format: (val: number) => `${val.toFixed(1)}/5`
                          },
                          {
                            label: 'Job Growth',
                            client: clientJobGrowth,
                            industry: industryAvg.averageJobGrowth,
                            unit: '%',
                            format: (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`
                          },
                          {
                            label: 'Health Score',
                            client: selectedClientForBenchmark.healthScore,
                            industry: industryAvg.averageHealthScore,
                            unit: '%',
                            format: (val: number) => `${val.toFixed(0)}%`
                          }
                        ]

                        return metrics.map((metric) => {
                          const difference = metric.client - metric.industry
                          const isPositive = difference > 0
                          const percentageDiff = ((difference / metric.industry) * 100)
                          
                          return (
                            <div key={metric.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {metric.label}
                                </span>
                                <div className={`flex items-center text-sm ${
                                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  <svg className={`w-4 h-4 mr-1 ${isPositive ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                                  </svg>
                                  {Math.abs(percentageDiff).toFixed(1)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Client: </span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {metric.format(metric.client)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-400">Industry: </span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {metric.format(metric.industry)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>
                  </div>

                  {/* Radar Chart */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Multi-Dimensional Comparison
                    </h4>
                    <ChartErrorBoundary>
                      <RadarChart
                        data={{
                          labels: ['Retention', 'Reviews', 'Job Growth', 'Health Score', 'Revenue'],
                          datasets: [
                            {
                              label: selectedClientForBenchmark.name,
                              data: [
                                85 + Math.floor(Math.random() * 15), // Retention
                                (3.5 + Math.random() * 1.5) * 20, // Reviews (scaled to 0-100)
                                Math.max(0, 50 + Math.random() * 50), // Job Growth (scaled to 0-100)
                                selectedClientForBenchmark.healthScore, // Health Score
                                Math.min(100, (selectedClientForBenchmark.totalRevenue / 300) * 100) // Revenue (scaled)
                              ]
                            },
                            {
                              label: 'Industry Average',
                              data: [
                                industryAverages[0].averageRetention,
                                industryAverages[0].averageReviews * 20,
                                Math.max(0, 50 + industryAverages[0].averageJobGrowth),
                                industryAverages[0].averageHealthScore,
                                Math.min(100, (industryAverages[0].averageRevenue / 300) * 100)
                              ]
                            }
                          ]
                        }}
                        className="h-80"
                      />
                    </ChartErrorBoundary>
                  </div>
                </div>

                {/* Insights and Recommendations */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-md font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Insights & Recommendations
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <p>
                      • <strong>{selectedClientForBenchmark.name}</strong> shows {selectedClientForBenchmark.healthScore >= 80 ? 'strong' : selectedClientForBenchmark.healthScore >= 60 ? 'moderate' : 'concerning'} performance with a {selectedClientForBenchmark.healthScore}% health score.
                    </p>
                    <p>
                      • Revenue of {formatCurrency(selectedClientForBenchmark.totalRevenue)} {selectedClientForBenchmark.totalRevenue > 15000 ? 'exceeds' : 'is below'} the high-performer threshold.
                    </p>
                    <p>
                      • Consider {selectedClientForBenchmark.healthScore < 70 ? 'immediate engagement and support initiatives' : 'upselling opportunities and loyalty programs'} for this client.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <ClientComparison />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}