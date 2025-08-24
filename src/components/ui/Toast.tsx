'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
  onClose?: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, type, title, message, duration = 5000, onClose, action }, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    useEffect(() => {
      // Trigger entrance animation
      const timer = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [duration])

    const handleClose = () => {
      setIsExiting(true)
      setTimeout(() => {
        onClose?.(id)
      }, 300) // Match animation duration
    }

    const typeStyles = {
      success: {
        container: 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800',
        icon: 'text-green-600 dark:text-green-400',
        title: 'text-green-800 dark:text-green-200',
        message: 'text-green-700 dark:text-green-300'
      },
      error: {
        container: 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800',
        icon: 'text-red-600 dark:text-red-400',
        title: 'text-red-800 dark:text-red-200',
        message: 'text-red-700 dark:text-red-300'
      },
      warning: {
        container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800',
        icon: 'text-yellow-600 dark:text-yellow-400',
        title: 'text-yellow-800 dark:text-yellow-200',
        message: 'text-yellow-700 dark:text-yellow-300'
      },
      info: {
        container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800',
        icon: 'text-blue-600 dark:text-blue-400',
        title: 'text-blue-800 dark:text-blue-200',
        message: 'text-blue-700 dark:text-blue-300'
      }
    }

    const icons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }

    const styles = typeStyles[type]

    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-out',
          styles.container,
          isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
          isExiting && 'translate-x-full opacity-0'
        )}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className={cn('flex-shrink-0', styles.icon)}>
              {icons[type]}
            </div>
            <div className="ml-3 w-0 flex-1">
              {title && (
                <p className={cn('text-sm font-medium', styles.title)}>
                  {title}
                </p>
              )}
              <p className={cn('text-sm', title ? 'mt-1' : '', styles.message)}>
                {message}
              </p>
              {action && (
                <div className="mt-3">
                  <button
                    type="button"
                    className={cn(
                      'rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                      type === 'success' && 'text-green-600 hover:text-green-500 focus:ring-green-500 dark:text-green-400 dark:hover:text-green-300',
                      type === 'error' && 'text-red-600 hover:text-red-500 focus:ring-red-500 dark:text-red-400 dark:hover:text-red-300',
                      type === 'warning' && 'text-yellow-600 hover:text-yellow-500 focus:ring-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300',
                      type === 'info' && 'text-blue-600 hover:text-blue-500 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
                    )}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className={cn(
                  'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  styles.icon,
                  'hover:opacity-75 focus:ring-gray-500'
                )}
                onClick={handleClose}
                aria-label="Close notification"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div className="h-1 bg-black/10 dark:bg-white/10">
            <div 
              className={cn(
                'h-full transition-all ease-linear',
                type === 'success' && 'bg-green-500',
                type === 'error' && 'bg-red-500',
                type === 'warning' && 'bg-yellow-500',
                type === 'info' && 'bg-blue-500'
              )}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    )
  }
)

Toast.displayName = 'Toast'

export { Toast }