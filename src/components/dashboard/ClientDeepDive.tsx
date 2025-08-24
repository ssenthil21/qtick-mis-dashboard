'use client'

import { useState } from 'react'
import { Client } from '@/types/domain'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { HealthBadge, StatusBadge } from '@/components/ui/Badge'
import { BarChart, DoughnutChart, ChartErrorBoundary } from '@/components/charts'

interface ClientDeepDiveProps {
  client: Client | null
  onClose: () => void
}

type TabType = 'overview' | 'notes'

export function ClientDeepDive({ client, onClose }: ClientDeepDiveProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (!client) return null

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

  const getHealthScore = (client: Client) => {
    // Use the existing healthScore from the client data
    if (client.healthScore >= 80) {
      return { score: 'Green' as const, percentage: client.healthScore }
    } else if (client.healthScore >= 60) {
      return { score: 'Yellow' as const, percentage: client.healthScore }
    } else {
      return { score: 'Red' as const, percentage: client.healthScore }
    }
  }

  const healthScore = getHealthScore(client)

  return (
    <div id="client-details" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {client.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Client ID: {client.id} • {client.industry}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close client details"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Client details tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            aria-selected={activeTab === 'overview'}
            role="tab"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'notes'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
            aria-selected={activeTab === 'notes'}
            role="tab"
          >
            Notes & Activity
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-8" role="tabpanel" aria-labelledby="overview-tab">
            {/* Client Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={client.status} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Health Score</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <HealthBadge score={healthScore.score} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {healthScore.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Activity</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {formatDate(client.lastActivity)}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Join Date</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {formatDate(client.joinDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Client KPI Cards */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                  title="Monthly Jobs"
                  value={client.monthlyJobs}
                  gradient="blue"
                  change={{ value: 12.5, type: 'increase', period: 'vs last month' }}
                  tooltip={`Total jobs completed this month by ${client.name}`}
                  icon={
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                />
                
                <KpiCard
                  title="Total Revenue"
                  value={formatCurrency(client.totalRevenue)}
                  gradient="green"
                  change={{ value: 8.3, type: 'increase', period: 'vs last month' }}
                  tooltip={`Total revenue generated by ${client.name}`}
                  icon={
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  }
                />
                
                <KpiCard
                  title="Customer Type"
                  value={client.newCustomer ? "New Customer" : "Existing"}
                  gradient="purple"
                  change={{ value: client.newCustomer ? 100 : 0, type: client.newCustomer ? 'increase' : 'decrease', period: 'status' }}
                  tooltip={`${client.name} is ${client.newCustomer ? 'a new customer' : 'an existing customer'}`}
                  icon={
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  }
                />
                
                <KpiCard
                  title="Repeat Customer"
                  value={client.repeatCustomer ? "Yes" : "No"}
                  gradient="orange"
                  change={{ value: client.repeatCustomer ? 15.2 : -5.2, type: client.repeatCustomer ? 'increase' : 'decrease', period: 'loyalty score' }}
                  tooltip={`${client.name} ${client.repeatCustomer ? 'is a repeat customer with multiple bookings' : 'is not yet a repeat customer'}`}
                  icon={
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  }
                />
                
                <KpiCard
                  title="Average Review"
                  value={`${(client.averageReview || 4.0).toFixed(1)}/5`}
                  gradient="teal"
                  change={{ value: 8.3, type: 'increase', period: 'vs last month' }}
                  tooltip={`Average customer review rating for ${client.name}`}
                  icon={
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Feature Usage Breakdown */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {client.features.map((feature) => (
                  <div key={feature.featureName} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {feature.featureName}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                          {feature.usageCount}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {feature.adoptionRate}% adoption
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        feature.category === 'Core' ? 'bg-green-100 dark:bg-green-900' :
                        feature.category === 'Advanced' ? 'bg-blue-100 dark:bg-blue-900' :
                        'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        <svg className={`w-6 h-6 ${
                          feature.category === 'Core' ? 'text-green-600 dark:text-green-400' :
                          feature.category === 'Advanced' ? 'text-blue-600 dark:text-blue-400' :
                          'text-purple-600 dark:text-purple-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Performance */}
            {client.staff.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Staff Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {client.staff.map((staff) => (
                    <div key={staff.staffId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{staff.name}</h5>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{staff.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{staff.customerRating}/5</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Jobs</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{staff.jobsCompleted}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Efficiency</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{staff.efficiency}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics Charts</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Jobs Bar Chart */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <ChartErrorBoundary>
                    <BarChart
                      title="Monthly Jobs Trend"
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [
                          {
                            label: 'Jobs Completed',
                            data: [
                              Math.max(0, client.monthlyJobs - 50 + Math.floor(Math.random() * 20)),
                              Math.max(0, client.monthlyJobs - 30 + Math.floor(Math.random() * 20)),
                              Math.max(0, client.monthlyJobs - 20 + Math.floor(Math.random() * 20)),
                              Math.max(0, client.monthlyJobs - 10 + Math.floor(Math.random() * 20)),
                              Math.max(0, client.monthlyJobs - 5 + Math.floor(Math.random() * 15)),
                              client.monthlyJobs
                            ]
                          }
                        ]
                      }}
                    />
                  </ChartErrorBoundary>
                </div>

                {/* Customer Type Doughnut Chart */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <ChartErrorBoundary>
                    <DoughnutChart
                      title="Customer Distribution"
                      data={{
                        labels: ['New Customers', 'Repeat Customers', 'VIP Customers'],
                        datasets: [
                          {
                            data: [
                              Math.floor(client.monthlyJobs * 0.3), // 30% new
                              Math.floor(client.monthlyJobs * 0.6), // 60% repeat
                              Math.floor(client.monthlyJobs * 0.1)  // 10% VIP
                            ]
                          }
                        ]
                      }}
                    />
                  </ChartErrorBoundary>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className="btn btn-primary px-6 py-3 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login as Client</span>
              </button>
              
              <button className="btn btn-secondary px-6 py-3 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Renewal Credits</span>
              </button>
              
              <button className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Contact Client</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-6" role="tabpanel" aria-labelledby="notes-tab">
            {/* Notes Editor */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Client Notes</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <textarea
                  className="w-full h-32 bg-transparent border-none resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Add notes about this client..."
                  defaultValue={`Client has been consistently performing well with high job volume and customer satisfaction. Last renewal was smooth with no issues. Consider offering premium features for their growing business needs.`}
                />
                <div className="flex justify-end mt-4">
                  <button className="btn btn-primary px-4 py-2 rounded-lg text-sm">
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {[
                  {
                    date: '2024-01-15',
                    action: 'Subscription renewed',
                    details: 'Annual subscription renewed for $2,400',
                    type: 'success'
                  },
                  {
                    date: '2024-01-10',
                    action: 'Support ticket resolved',
                    details: 'Issue with billing integration resolved',
                    type: 'info'
                  },
                  {
                    date: '2024-01-05',
                    action: 'Feature usage spike',
                    details: 'Appointments feature usage increased by 45%',
                    type: 'warning'
                  },
                  {
                    date: '2023-12-28',
                    action: 'Client onboarded',
                    details: 'Successfully completed onboarding process',
                    type: 'success'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(activity.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}