'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useThrottledCallback } from '@/lib/performance'

interface ActivityItem {
  id: string
  type: 'user_login' | 'subscription_created' | 'payment_received' | 'support_ticket' | 'feature_used'
  message: string
  timestamp: Date
  user?: string
  metadata?: Record<string, any>
}

const ACTIVITY_TYPES = [
  'user_login',
  'subscription_created', 
  'payment_received',
  'support_ticket',
  'feature_used'
] as const

const SAMPLE_MESSAGES = {
  user_login: [
    'User logged in from mobile app',
    'User accessed dashboard',
    'User logged in from web browser',
    'User authenticated via SSO'
  ],
  subscription_created: [
    'New subscription created',
    'Trial subscription started',
    'Premium subscription activated',
    'Enterprise plan selected'
  ],
  payment_received: [
    'Monthly payment processed',
    'Annual subscription renewed',
    'Payment method updated',
    'Invoice payment received'
  ],
  support_ticket: [
    'New support ticket created',
    'Support ticket resolved',
    'Priority ticket escalated',
    'Customer feedback received'
  ],
  feature_used: [
    'Report generated',
    'Data export completed',
    'Integration configured',
    'API endpoint accessed'
  ]
}

const SAMPLE_USERS = [
  'John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis',
  'Alex Rodriguez', 'Lisa Wang', 'David Brown', 'Jessica Lee',
  'Ryan Taylor', 'Amanda Wilson', 'Chris Martinez', 'Nicole Thompson'
]

export function useLiveFeed(maxItems: number = 50, updateInterval: number = 2000) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isActive, setIsActive] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()
  const activityCounterRef = useRef(0)
  const isVisibleRef = useRef(true)

  // Generate a random activity item
  const generateActivity = useCallback((): ActivityItem => {
    const type = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)]
    const messages = SAMPLE_MESSAGES[type]
    const message = messages[Math.floor(Math.random() * messages.length)]
    const user = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    
    activityCounterRef.current += 1
    
    return {
      id: `activity-${Date.now()}-${activityCounterRef.current}`,
      type,
      message,
      timestamp: new Date(),
      user,
      metadata: {
        source: Math.random() > 0.5 ? 'web' : 'mobile',
        location: ['US', 'CA', 'UK', 'DE', 'FR'][Math.floor(Math.random() * 5)]
      }
    }
  }, [])

  // Throttled activity addition to prevent performance issues
  const addActivity = useThrottledCallback((newActivity: ActivityItem) => {
    setActivities(prev => {
      const updated = [newActivity, ...prev]
      // Keep only the most recent items
      return updated.slice(0, maxItems)
    })
  }, 100) // Throttle to max 10 updates per second

  // Batch activity generation for better performance
  const generateBatchActivities = useCallback((count: number = 1) => {
    const newActivities: ActivityItem[] = []
    for (let i = 0; i < count; i++) {
      newActivities.push(generateActivity())
    }
    
    setActivities(prev => {
      const updated = [...newActivities, ...prev]
      return updated.slice(0, maxItems)
    })
  }, [generateActivity, maxItems])

  // Page visibility handling to pause updates when not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden
      
      if (document.hidden) {
        // Page is hidden, pause updates
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      } else {
        // Page is visible, resume updates
        if (isActive) {
          startLiveFeed()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isActive])

  // Start the live feed
  const startLiveFeed = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (isVisibleRef.current) {
      intervalRef.current = setInterval(() => {
        // Randomly generate 1-3 activities per interval
        const activityCount = Math.floor(Math.random() * 3) + 1
        
        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          if (activityCount === 1) {
            addActivity(generateActivity())
          } else {
            generateBatchActivities(activityCount)
          }
        })
      }, updateInterval)
    }
  }, [addActivity, generateActivity, generateBatchActivities, updateInterval])

  // Stop the live feed
  const stopLiveFeed = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
  }, [])

  // Toggle live feed
  const toggleLiveFeed = useCallback(() => {
    setIsActive(prev => {
      const newState = !prev
      if (newState && isVisibleRef.current) {
        startLiveFeed()
      } else {
        stopLiveFeed()
      }
      return newState
    })
  }, [startLiveFeed, stopLiveFeed])

  // Clear all activities
  const clearActivities = useCallback(() => {
    setActivities([])
    activityCounterRef.current = 0
  }, [])

  // Add manual activity
  const addManualActivity = useCallback((activity: Partial<ActivityItem>) => {
    const fullActivity: ActivityItem = {
      id: `manual-${Date.now()}-${activityCounterRef.current++}`,
      type: 'feature_used',
      message: 'Manual activity added',
      timestamp: new Date(),
      ...activity
    }
    
    addActivity(fullActivity)
  }, [addActivity])

  // Initialize live feed
  useEffect(() => {
    if (isActive && isVisibleRef.current) {
      // Generate initial activities
      generateBatchActivities(5)
      startLiveFeed()
    }
    
    return () => {
      stopLiveFeed()
    }
  }, [isActive, startLiveFeed, stopLiveFeed, generateBatchActivities])

  // Performance monitoring
  const getPerformanceStats = useCallback(() => {
    return {
      totalActivities: activities.length,
      isActive,
      isVisible: isVisibleRef.current,
      updateInterval,
      maxItems
    }
  }, [activities.length, isActive, updateInterval, maxItems])

  return {
    activities,
    isActive,
    startLiveFeed,
    stopLiveFeed,
    toggleLiveFeed,
    clearActivities,
    addManualActivity,
    generateBatchActivities,
    getPerformanceStats
  }
}