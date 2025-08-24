'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

interface Activity {
  id: string
  type: 'user_login' | 'job_completed' | 'payment_received' | 'new_client' | 'system_alert' | 'review_posted'
  message: string
  timestamp: Date
  client?: string
  user?: string
  amount?: number
  isNew?: boolean
}

const activityTemplates = [
  { type: 'user_login', message: 'User {user} logged in', users: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Wong', 'David Brown'] },
  { type: 'job_completed', message: 'Job completed for {client}', clients: ['Bella Salon', 'Zen Spa', 'Elite Fitness', 'Fresh Laundry', 'Gourmet Truck'] },
  { type: 'payment_received', message: 'Payment of ${amount} received from {client}', amounts: [150, 250, 89, 320, 175, 95, 450] },
  { type: 'new_client', message: 'New client {client} registered', clients: ['Luxury Nails', 'Wellness Center', 'Prime Cuts', 'Sparkle Clean', 'Tasty Bites'] },
  { type: 'system_alert', message: 'System backup completed successfully' },
  { type: 'review_posted', message: 'New 5-star review posted for {client}', clients: ['Bella Salon', 'Zen Spa', 'Elite Fitness', 'Fresh Laundry', 'Gourmet Truck'] }
]

function generateRandomActivity(): Activity {
  const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)]
  const id = Math.random().toString(36).substr(2, 9)

  let message = template.message
  let client: string | undefined
  let user: string | undefined
  let amount: number | undefined

  if (template.clients && message.includes('{client}')) {
    client = template.clients[Math.floor(Math.random() * template.clients.length)]
    message = message.replace('{client}', client)
  }

  if (template.users && message.includes('{user}')) {
    user = template.users[Math.floor(Math.random() * template.users.length)]
    message = message.replace('{user}', user)
  }

  if (template.amounts && message.includes('{amount}')) {
    amount = template.amounts[Math.floor(Math.random() * template.amounts.length)]
    message = message.replace('{amount}', amount.toString())
  }

  return {
    id,
    type: template.type as Activity['type'],
    message,
    timestamp: new Date(),
    client,
    user,
    amount,
    isNew: true
  }
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'user_login':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'job_completed':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'payment_received':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    case 'new_client':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    case 'system_alert':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'review_posted':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
  }
}

function getActivityColor(type: Activity['type']) {
  switch (type) {
    case 'user_login':
      return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
    case 'job_completed':
      return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20'
    case 'payment_received':
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20'
    case 'new_client':
      return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20'
    case 'system_alert':
      return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20'
    case 'review_posted':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20'
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
  }
}

export default function LiveOpsPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Generate initial activities
  useEffect(() => {
    const initialActivities = Array.from({ length: 10 }, () => {
      const activity = generateRandomActivity()
      activity.isNew = false
      return activity
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setActivities(initialActivities)
  }, [])

  // Start/stop activity generation based on visibility
  useEffect(() => {
    if (isVisible) {
      intervalRef.current = setInterval(() => {
        const newActivity = generateRandomActivity()

        setActivities(prev => {
          const updated = [newActivity, ...prev].slice(0, 50) // Limit to 50 items
          return updated
        })

        // Remove the "new" flag after animation
        setTimeout(() => {
          setActivities(prev =>
            prev.map(activity =>
              activity.id === newActivity.id
                ? { ...activity, isNew: false }
                : activity
            )
          )
        }, 1000)
      }, 2000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isVisible])

  return (
    <DashboardLayout showSearch={false}>
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Live Ops</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Cards */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
                    <p className="text-sm text-green-600 dark:text-green-400">All systems operational</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Users</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">247 online now</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activities</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activities.length} recent events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Live Activity Feed</h2>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isVisible ? 'Live' : 'Paused'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {activities.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">Loading activities...</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className={`p-4 transition-all duration-1000 ${activity.isNew
                            ? 'bg-blue-50 dark:bg-blue-900/10 animate-pulse'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white">
                                {activity.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {activity.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            {activity.isNew && (
                              <div className="flex-shrink-0">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                  New
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}