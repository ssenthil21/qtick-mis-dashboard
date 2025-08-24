'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface GA4Metric {
  name: string
  value: string
  change: number
  changeType: 'increase' | 'decrease'
  icon: React.ReactNode
  color: string
}

interface TopPage {
  path: string
  title: string
  pageViews: number
  uniquePageViews: number
  avgTimeOnPage: string
  bounceRate: number
  conversions: number
}

interface UserSegment {
  segment: string
  users: number
  sessions: number
  bounceRate: number
  avgSessionDuration: string
  color: string
}

const ga4Metrics: GA4Metric[] = [
  {
    name: 'Total Users',
    value: '24,847',
    change: 12.5,
    changeType: 'increase',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    )
  },
  {
    name: 'Sessions',
    value: '38,492',
    change: 8.3,
    changeType: 'increase',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    name: 'Page Views',
    value: '156,234',
    change: 15.7,
    changeType: 'increase',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    )
  },
  {
    name: 'Avg Session Duration',
    value: '3m 42s',
    change: -2.1,
    changeType: 'decrease',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    name: 'Bounce Rate',
    value: '42.3%',
    change: -5.2,
    changeType: 'decrease',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    )
  },
  {
    name: 'Conversions',
    value: '1,847',
    change: 23.4,
    changeType: 'increase',
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
]

const topPages: TopPage[] = [
  {
    path: '/',
    title: 'QTick Home Page',
    pageViews: 45234,
    uniquePageViews: 38492,
    avgTimeOnPage: '2m 34s',
    bounceRate: 38.2,
    conversions: 892
  },
  {
    path: '/demo',
    title: 'Product Demo',
    pageViews: 28947,
    uniquePageViews: 24583,
    avgTimeOnPage: '4m 12s',
    bounceRate: 25.7,
    conversions: 456
  },
  {
    path: '/features',
    title: 'Features Page',
    pageViews: 19834,
    uniquePageViews: 17293,
    avgTimeOnPage: '3m 45s',
    bounceRate: 31.4,
    conversions: 234
  },
  {
    path: '/contact',
    title: 'Contact Us',
    pageViews: 15672,
    uniquePageViews: 13845,
    avgTimeOnPage: '5m 18s',
    bounceRate: 22.8,
    conversions: 189
  },
  {
    path: '/billing',
    title: 'Billing & Pricing',
    pageViews: 12456,
    uniquePageViews: 10923,
    avgTimeOnPage: '3m 56s',
    bounceRate: 35.1,
    conversions: 156
  },
  {
    path: '/reports',
    title: 'Reports & Analytics',
    pageViews: 8934,
    uniquePageViews: 7821,
    avgTimeOnPage: '6m 23s',
    bounceRate: 18.9,
    conversions: 98
  },
  {
    path: '/whatsapp',
    title: 'WhatsApp Integration',
    pageViews: 7234,
    uniquePageViews: 6456,
    avgTimeOnPage: '2m 47s',
    bounceRate: 42.3,
    conversions: 67
  },
  {
    path: '/support',
    title: 'Customer Support',
    pageViews: 5892,
    uniquePageViews: 5234,
    avgTimeOnPage: '4m 31s',
    bounceRate: 28.6,
    conversions: 45
  }
]

const userSegments: UserSegment[] = [
  {
    segment: 'New Users',
    users: 15234,
    sessions: 18492,
    bounceRate: 48.3,
    avgSessionDuration: '2m 45s',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  },
  {
    segment: 'Returning Users',
    users: 9613,
    sessions: 20000,
    bounceRate: 35.7,
    avgSessionDuration: '4m 52s',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  },
  {
    segment: 'Mobile Users',
    users: 18456,
    sessions: 22847,
    bounceRate: 52.1,
    avgSessionDuration: '2m 18s',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  },
  {
    segment: 'Desktop Users',
    users: 6391,
    sessions: 15645,
    bounceRate: 28.4,
    avgSessionDuration: '5m 34s',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
  }
]

export default function GA4AnalyticsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">GA4 Analytics</h1>
              </div>
              <div className="mt-4 sm:mt-0">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* GA4 Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ga4Metrics.map((metric, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.name}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      metric.changeType === 'increase' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      <svg className={`w-3 h-3 mr-1 ${metric.changeType === 'increase' ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                      {Math.abs(metric.change)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Pages Table */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Pages</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Most visited pages and their performance metrics
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Page
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Page Views
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Avg Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Bounce Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Conversions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {topPages.map((page, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {page.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {page.path}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white font-medium">
                              {formatNumber(page.pageViews)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatNumber(page.uniquePageViews)} unique
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {page.avgTimeOnPage}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              page.bounceRate < 30 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : page.bounceRate < 50
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {page.bounceRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                            {page.conversions}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* User Segments */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Segments</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    User behavior by segment
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  {userSegments.map((segment, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${segment.color}`}>
                          {segment.segment}
                        </span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatNumber(segment.users)} users
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {formatNumber(segment.sessions)} sessions
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 dark:text-gray-400">Bounce Rate</div>
                          <div className="font-medium text-gray-900 dark:text-white">{segment.bounceRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500 dark:text-gray-400">Avg Duration</div>
                          <div className="font-medium text-gray-900 dark:text-white">{segment.avgSessionDuration}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Users */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Real-time</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Users active right now
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                      247
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Active users in the last 30 minutes
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs text-green-600 dark:text-green-400">Live</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Top Active Page</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">/demo</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Top Country</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">India</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Top Device</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Mobile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}