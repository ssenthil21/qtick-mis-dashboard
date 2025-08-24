import { useMemo, useCallback, useRef, useEffect, useState } from 'react'

/**
 * Memoized calculation hook for expensive operations
 */
export function useMemoizedCalculation<T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(calculation, dependencies)
}

/**
 * Debounced callback hook
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    }) as T,
    [delay]
  )
}

/**
 * Throttled callback hook
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const callbackRef = useRef(callback)
  const lastRunRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now()
      
      if (now - lastRunRef.current >= limit) {
        callbackRef.current(...args)
        lastRunRef.current = now
      } else {
        // Schedule the call for when the throttle period expires
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args)
          lastRunRef.current = Date.now()
        }, limit - (now - lastRunRef.current))
      }
    }) as T,
    [limit]
  )
}

/**
 * Memoized filter hook for large datasets
 */
export function useMemoizedFilter<T>(
  items: T[],
  filterFn: (item: T) => boolean,
  dependencies: React.DependencyList
): T[] {
  return useMemo(() => {
    if (!items || items.length === 0) return []
    return items.filter(filterFn)
  }, [items, ...dependencies])
}

/**
 * Memoized sort hook for large datasets
 */
export function useMemoizedSort<T>(
  items: T[],
  sortFn: (a: T, b: T) => number,
  dependencies: React.DependencyList
): T[] {
  return useMemo(() => {
    if (!items || items.length === 0) return []
    return [...items].sort(sortFn)
  }, [items, ...dependencies])
}

/**
 * Virtual scrolling hook for large lists
 */
export function useVirtualScrolling(
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number
) {
  return useMemo(() => {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight)
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleItemCount + 1, itemCount)
    const offsetY = startIndex * itemHeight

    return {
      startIndex: Math.max(0, startIndex),
      endIndex,
      offsetY,
      visibleItemCount
    }
  }, [itemCount, itemHeight, containerHeight, scrollTop])
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) {
  const observerRef = useRef<IntersectionObserver>()
  
  const observe = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element)
    }
  }, [])
  
  const unobserve = useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element)
    }
  }, [])
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options)
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [callback, options])
  
  return { observe, unobserve }
}

/**
 * Performance monitoring hook
 */
export function usePerformanceMonitor(name: string) {
  const startTimeRef = useRef<number>()
  
  const start = useCallback(() => {
    startTimeRef.current = performance.now()
  }, [])
  
  const end = useCallback(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
      return duration
    }
    return 0
  }, [name])
  
  return { start, end }
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    }
  }
  return null
}

/**
 * Batch updates hook to reduce re-renders
 */
export function useBatchedUpdates<T>(
  initialValue: T,
  batchDelay: number = 16 // One frame at 60fps
) {
  const [value, setValue] = useState(initialValue)
  const pendingValueRef = useRef<T>(initialValue)
  const timeoutRef = useRef<NodeJS.Timeout>()
  
  const batchedSetValue = useCallback((newValue: T | ((prev: T) => T)) => {
    const resolvedValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(pendingValueRef.current)
      : newValue
    
    pendingValueRef.current = resolvedValue
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setValue(pendingValueRef.current)
    }, batchDelay)
  }, [batchDelay])
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return [value, batchedSetValue] as const
}