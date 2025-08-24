'use client'

import { useEffect, useRef } from 'react'
import { sampleNotifications } from '@/lib/seed'
import { Notification } from '@/types/domain'

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
  notifications?: Notification[]
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'success':
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )
    case 'warning':
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      )
    case 'error':
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    case 'info':
    default:
      return (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
  }
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const notificationTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
}

export function NotificationsPanel({ 
  isOpen, 
  onClose, 
  notifications = sampleNotifications 
}: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Focus management
  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Focus the panel
      panelRef.current.focus()
    } else if (!isOpen && previousFocusRef.current) {
      // Return focus to the previously focused element
      previousFocusRef.current.focus()
    }
  }, [isOpen])

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      // Add a small delay to prevent immediate closing when opening
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)
      
      return () => {
        clearTimeout(timer)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-200 ease-out animate-in fade-in-0 slide-in-from-top-2"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications panel"
      tabIndex={-1}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors"
          aria-label="Close notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              No notifications
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 transition-colors ${
                  !notification.read 
                    ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    {notification.actionUrl && (
                      <div className="mt-3">
                        <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                          View Details →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors">
              Mark all as read
            </button>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}