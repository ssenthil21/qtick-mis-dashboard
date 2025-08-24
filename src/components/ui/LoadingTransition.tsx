'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface LoadingTransitionProps {
  isLoading: boolean
  loadingComponent: React.ReactNode
  children: React.ReactNode
  className?: string
  delay?: number
  minLoadingTime?: number
}

/**
 * Component that provides smooth transitions between loading and loaded states
 */
export function LoadingTransition({
  isLoading,
  loadingComponent,
  children,
  className,
  delay = 0,
  minLoadingTime = 500
}: LoadingTransitionProps) {
  const [showLoading, setShowLoading] = useState(isLoading)
  const [showContent, setShowContent] = useState(!isLoading)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      setLoadingStartTime(Date.now())
      
      if (delay > 0) {
        const timer = setTimeout(() => {
          setShowLoading(true)
          setShowContent(false)
        }, delay)
        return () => clearTimeout(timer)
      } else {
        setShowLoading(true)
        setShowContent(false)
      }
    } else {
      // Calculate how long we've been loading
      const loadingDuration = loadingStartTime ? Date.now() - loadingStartTime : 0
      const remainingTime = Math.max(0, minLoadingTime - loadingDuration)
      
      if (remainingTime > 0) {
        // Wait for minimum loading time before showing content
        const timer = setTimeout(() => {
          setShowLoading(false)
          setTimeout(() => setShowContent(true), 150) // Small delay for smooth transition
        }, remainingTime)
        return () => clearTimeout(timer)
      } else {
        setShowLoading(false)
        setTimeout(() => setShowContent(true), 150)
      }
    }
  }, [isLoading, delay, minLoadingTime, loadingStartTime])

  return (
    <div className={cn('relative', className)}>
      {/* Loading State */}
      <div
        className={cn(
          'transition-opacity duration-300',
          showLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {loadingComponent}
      </div>

      {/* Content State */}
      <div
        className={cn(
          'transition-opacity duration-300',
          showContent ? 'opacity-100' : 'opacity-0 pointer-events-none',
          showLoading ? 'absolute inset-0' : ''
        )}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Hook for managing loading states with smooth transitions
 */
export function useLoadingTransition(initialLoading = false) {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)

  const startLoading = () => {
    setLoadingStartTime(Date.now())
    setIsLoading(true)
  }

  const stopLoading = (minLoadingTime = 500) => {
    if (loadingStartTime) {
      const loadingDuration = Date.now() - loadingStartTime
      const remainingTime = Math.max(0, minLoadingTime - loadingDuration)
      
      if (remainingTime > 0) {
        setTimeout(() => setIsLoading(false), remainingTime)
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
    setIsLoading
  }
}

/**
 * Staggered loading animation for lists
 */
interface StaggeredLoadingProps {
  items: any[]
  isLoading: boolean
  renderItem: (item: any, index: number) => React.ReactNode
  renderSkeleton: (index: number) => React.ReactNode
  staggerDelay?: number
  className?: string
}

export function StaggeredLoading({
  items,
  isLoading,
  renderItem,
  renderSkeleton,
  staggerDelay = 100,
  className
}: StaggeredLoadingProps) {
  const [visibleItems, setVisibleItems] = useState<number>(0)

  useEffect(() => {
    if (!isLoading && items.length > 0) {
      setVisibleItems(0)
      
      const showItems = () => {
        for (let i = 0; i < items.length; i++) {
          setTimeout(() => {
            setVisibleItems(prev => prev + 1)
          }, i * staggerDelay)
        }
      }
      
      // Small delay before starting the stagger
      setTimeout(showItems, 150)
    }
  }, [isLoading, items.length, staggerDelay])

  if (isLoading) {
    return (
      <div className={className}>
        {Array.from({ length: Math.max(5, items.length) }).map((_, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {renderSkeleton(index)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={cn(
            'transition-all duration-300',
            index < visibleItems
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          )}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton fade-out component for smooth transitions
 */
interface SkeletonFadeProps {
  isLoading: boolean
  skeleton: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SkeletonFade({ isLoading, skeleton, children, className }: SkeletonFadeProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Skeleton overlay */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-500 ease-out',
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {skeleton}
      </div>
      
      {/* Actual content */}
      <div
        className={cn(
          'transition-opacity duration-500 ease-out',
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
      >
        {children}
      </div>
    </div>
  )
}