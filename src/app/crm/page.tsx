'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { sampleClients, sampleCampaigns } from '@/lib/seed'

export default function CrmPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Client Segmentation Logic
  const segmentClients = () => {
    const loyal = sampleClients.filter(client => 
      client.status === 'Paid' && client.healthScore >= 80 && client.totalRevenue > 10000
    )
    
    const atRisk = sampleClients.filter(client => 
      client.healthScore < 60 || (client.status === 'Trial' && new Date(client.joinDate) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    )
    
    const newClients = sampleClients.filter(client => 
      new Date(client.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    )

    return { loyal, atRisk, newClients }
  }

  const { loyal, atRisk, newClients } = segmentClients()

  // Campaign Statistics
  const totalCampaigns = sampleCampaigns.length
  const activeCampaigns = sampleCampaigns.filter(c => c.status === 'Active').length
  const avgOpenRate = sampleCampaigns.reduce((sum, c) => sum + c.openRate, 0) / totalCampaigns
  const avgClickRate = sampleCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / totalCampaigns

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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CRM</h1>
          </div>

          {/* Client Segmentation KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <KpiCard
              title="Loyal Clients"
              value={loyal.length}
              gradient="green"
              change={{ value: 8.5, type: 'increase', period: 'vs last month' }}
              tooltip="High-value clients with excellent health scores and consistent revenue"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            />
            
            <KpiCard
              title="At-Risk Clients"
              value={atRisk.length}
              gradient="orange"
              change={{ value: 12.3, type: 'decrease', period: 'vs last month' }}
              tooltip="Clients with low health scores or extended trial periods requiring attention"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              }
            />
            
            <KpiCard
              title="New Clients"
              value={newClients.length}
              gradient="blue"
              change={{ value: 25.7, type: 'increase', period: 'vs last month' }}
              tooltip="Clients who joined within the last 30 days"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              }
            />
          </div>

          {/* Campaign Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Campaign Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalCampaigns}</div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">Total Campaigns</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCampaigns}</div>
                  <div className="text-sm text-green-800 dark:text-green-300">Active Campaigns</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{avgOpenRate.toFixed(1)}%</div>
                  <div className="text-sm text-purple-800 dark:text-purple-300">Avg Open Rate</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{avgClickRate.toFixed(1)}%</div>
                  <div className="text-sm text-orange-800 dark:text-orange-300">Avg Click Rate</div>
                </div>
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Campaigns</h3>
              <div className="space-y-4">
                {sampleCampaigns.slice(0, 3).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {campaign.type} • {campaign.targetSegment}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : campaign.status === 'Paused'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {campaign.status}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {campaign.openRate}% open rate
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Client Segment Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Loyal Clients */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Loyal Clients</h3>
              </div>
              <div className="space-y-3">
                {loyal.slice(0, 3).map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{client.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{client.industry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${client.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{client.healthScore}% health</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>Action:</strong> Consider upselling premium features and loyalty rewards programs.
                </p>
              </div>
            </div>

            {/* At-Risk Clients */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">At-Risk Clients</h3>
              </div>
              <div className="space-y-3">
                {atRisk.slice(0, 3).map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{client.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{client.industry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        {client.healthScore}% health
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{client.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  <strong>Action:</strong> Immediate outreach and support to prevent churn.
                </p>
              </div>
            </div>

            {/* New Clients */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">New Clients</h3>
              </div>
              <div className="space-y-3">
                {newClients.slice(0, 3).map((client) => (
                  <div key={client.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{client.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{client.industry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {new Date(client.joinDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{client.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Action:</strong> Onboarding campaigns and feature adoption tracking.
                </p>
              </div>
            </div>
          </div>

          {/* Campaign Performance Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Campaign Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Target
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Open Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Click Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sampleCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campaign.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campaign.targetSegment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campaign.sentCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campaign.openRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {campaign.clickRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'Active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : campaign.status === 'Paused'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}