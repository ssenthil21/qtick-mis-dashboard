'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Toast, ToastProps } from './Toast'
import { cn } from '@/lib/utils'

export interface ToastData extends Omit<ToastProps, 'id' | 'onClose'> {
  id?: string
}

interface ToasterContextValue {
  toasts: ToastProps[]
  addToast: (toast: ToastData) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
}

const ToasterContext = createContext<ToasterContextValue | undefined>(undefined)

export const useToaster = () => {
  const context = useContext(ToasterContext)
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider')
  }
  return context
}

interface ToasterProviderProps {
  children: ReactNode
  maxToasts?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export const ToasterProvider: React.FC<ToasterProviderProps> = ({ 
  children, 
  maxToasts = 5,
  position = 'top-right'
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toastData: ToastData): string => {
    const id = toastData.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const newToast: ToastProps = {
      ...toastData,
      id,
      onClose: (toastId) => removeToast(toastId)
    }

    setToasts(prev => {
      const updated = [newToast, ...prev]
      // Limit the number of toasts
      return updated.slice(0, maxToasts)
    })

    return id
  }, [maxToasts])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div
        className={cn(
          'fixed z-50 flex flex-col space-y-2 pointer-events-none',
          positionClasses[position]
        )}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToasterContext.Provider>
  )
}

// Convenience hooks for different toast types
export const useToast = () => {
  const { addToast } = useToaster()

  return {
    toast: addToast,
    success: (message: string, options?: Partial<ToastData>) =>
      addToast({ type: 'success', message, ...options }),
    error: (message: string, options?: Partial<ToastData>) =>
      addToast({ type: 'error', message, ...options }),
    warning: (message: string, options?: Partial<ToastData>) =>
      addToast({ type: 'warning', message, ...options }),
    info: (message: string, options?: Partial<ToastData>) =>
      addToast({ type: 'info', message, ...options })
  }
}