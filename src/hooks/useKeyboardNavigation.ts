'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardNavigationOptions {
  shortcuts?: KeyboardShortcut[]
  enableGlobalShortcuts?: boolean
}

const defaultShortcuts: KeyboardShortcut[] = [
  {
    key: 'd',
    altKey: true,
    action: () => window.location.href = '/',
    description: 'Go to Dashboard (Alt+D)'
  },
  {
    key: 'a',
    altKey: true,
    action: () => window.location.href = '/analytics',
    description: 'Go to Analytics (Alt+A)'
  },
  {
    key: 'c',
    altKey: true,
    action: () => window.location.href = '/crm',
    description: 'Go to CRM (Alt+C)'
  },
  {
    key: 'r',
    altKey: true,
    action: () => window.location.href = '/reports',
    description: 'Go to Reports (Alt+R)'
  },
  {
    key: 'l',
    altKey: true,
    action: () => window.location.href = '/live-ops',
    description: 'Go to Live Ops (Alt+L)'
  },
  {
    key: 'm',
    altKey: true,
    action: () => window.location.href = '/admin',
    description: 'Go to Admin (Alt+M)'
  },
  {
    key: '/',
    ctrlKey: true,
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    },
    description: 'Focus search (Ctrl+/)'
  },
  {
    key: 'k',
    ctrlKey: true,
    action: () => {
      const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    },
    description: 'Focus search (Ctrl+K)'
  },
  {
    key: 'Escape',
    action: () => {
      // Close any open modals or panels
      const closeButtons = document.querySelectorAll('[aria-label*="Close"], [aria-label*="close"]')
      const lastCloseButton = closeButtons[closeButtons.length - 1] as HTMLElement
      if (lastCloseButton) {
        lastCloseButton.click()
      }
      
      // Clear search if focused
      const searchInput = document.querySelector('input[placeholder*="Search"]:focus') as HTMLInputElement
      if (searchInput) {
        searchInput.blur()
      }
    },
    description: 'Close modals/panels or blur search (Escape)'
  },
  {
    key: '?',
    shiftKey: true,
    action: () => {
      // Show keyboard shortcuts help
      console.log('Keyboard shortcuts:', defaultShortcuts.map(s => s.description))
      // In a real app, this would open a help modal
    },
    description: 'Show keyboard shortcuts help (Shift+?)'
  }
]

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions = {}) {
  const { shortcuts = [], enableGlobalShortcuts = true } = options
  const router = useRouter()

  const allShortcuts = enableGlobalShortcuts 
    ? [...defaultShortcuts, ...shortcuts]
    : shortcuts

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs (except for specific cases)
    const target = event.target as HTMLElement
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true'

    // Allow Escape and Ctrl+K/Ctrl+/ even in input elements
    const allowInInputs = event.key === 'Escape' || 
                         (event.ctrlKey && (event.key === 'k' || event.key === '/'))

    if (isInputElement && !allowInInputs) {
      return
    }

    // Find matching shortcut
    const matchingShortcut = allShortcuts.find(shortcut => {
      return shortcut.key.toLowerCase() === event.key.toLowerCase() &&
             !!shortcut.ctrlKey === event.ctrlKey &&
             !!shortcut.altKey === event.altKey &&
             !!shortcut.shiftKey === event.shiftKey &&
             !!shortcut.metaKey === event.metaKey
    })

    if (matchingShortcut) {
      event.preventDefault()
      event.stopPropagation()
      matchingShortcut.action()
    }
  }, [allShortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Function to get all available shortcuts for help display
  const getShortcuts = useCallback(() => {
    return allShortcuts.map(shortcut => ({
      key: shortcut.key,
      modifiers: {
        ctrl: shortcut.ctrlKey,
        alt: shortcut.altKey,
        shift: shortcut.shiftKey,
        meta: shortcut.metaKey
      },
      description: shortcut.description
    }))
  }, [allShortcuts])

  return { getShortcuts }
}

// Hook for managing focus trap in modals and panels
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    
    // Focus first element when trap becomes active
    if (firstElement) {
      firstElement.focus()
    }

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  }, [isActive, containerRef])
}

// Hook for managing roving tabindex (for component groups like tabs, menus)
export function useRovingTabIndex(
  items: React.RefObject<HTMLElement>[],
  orientation: 'horizontal' | 'vertical' = 'horizontal'
) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isHorizontal = orientation === 'horizontal'
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

      if (event.key === nextKey) {
        event.preventDefault()
        setActiveIndex(prev => (prev + 1) % items.length)
      } else if (event.key === prevKey) {
        event.preventDefault()
        setActiveIndex(prev => (prev - 1 + items.length) % items.length)
      } else if (event.key === 'Home') {
        event.preventDefault()
        setActiveIndex(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        setActiveIndex(items.length - 1)
      }
    }

    // Add event listeners to all items
    items.forEach(item => {
      if (item.current) {
        item.current.addEventListener('keydown', handleKeyDown)
      }
    })

    return () => {
      items.forEach(item => {
        if (item.current) {
          item.current.removeEventListener('keydown', handleKeyDown)
        }
      })
    }
  }, [items, orientation])

  // Update tabindex for all items
  useEffect(() => {
    items.forEach((item, index) => {
      if (item.current) {
        item.current.tabIndex = index === activeIndex ? 0 : -1
        if (index === activeIndex) {
          item.current.focus()
        }
      }
    })
  }, [activeIndex, items])

  return { activeIndex, setActiveIndex }
}

// Import useState for roving tabindex
import { useState } from 'react'