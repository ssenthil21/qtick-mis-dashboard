'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  description?: string
}

export interface SidebarNavProps {
  className?: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

const navigationItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    description: 'Overview and key metrics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    )
  },
  {
    name: 'Analytics',
    href: '/analytics',
    description: 'Revenue and performance analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    name: 'GA4 Analytics',
    href: '/ga4-analytics',
    description: 'Google Analytics insights',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    name: 'CRM',
    href: '/crm',
    description: 'Customer relationship management',
    badge: '3',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    name: 'Live Ops',
    href: '/live-ops',
    description: 'Real-time operations monitoring',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    name: 'Reports',
    href: '/reports',
    description: 'Generate and view reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    name: 'Admin',
    href: '/admin',
    description: 'User and system administration',
    badge: 'New',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
]

const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, collapsed = false, onToggleCollapse }, ref) => {
    const pathname = usePathname()
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [focusedIndex, setFocusedIndex] = useState<number>(-1)

    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          const nextIndex = index < navigationItems.length - 1 ? index + 1 : 0
          setFocusedIndex(nextIndex)
          break
        case 'ArrowUp':
          event.preventDefault()
          const prevIndex = index > 0 ? index - 1 : navigationItems.length - 1
          setFocusedIndex(prevIndex)
          break
        case 'Home':
          event.preventDefault()
          setFocusedIndex(0)
          break
        case 'End':
          event.preventDefault()
          setFocusedIndex(navigationItems.length - 1)
          break
      }
    }

    const isActive = (href: string) => {
      if (href === '/') {
        return pathname === '/'
      }
      return pathname.startsWith(href)
    }

    return (
      <nav
        ref={ref}
        className={cn(
          'flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className={cn(
            'flex items-center space-x-3 transition-opacity duration-200',
            collapsed && 'opacity-0'
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">QTick</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">MIS Dashboard</p>
            </div>
          </div>
          
          <button
            onClick={onToggleCollapse}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg 
              className={cn(
                'w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200',
                collapsed && 'rotate-180'
              )} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1 px-3" role="list" aria-label="Navigation menu">
            {navigationItems.map((item, index) => {
              const active = isActive(item.href)
              const hovered = hoveredItem === item.name
              const focused = focusedIndex === index
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                      active
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
                      collapsed && 'justify-center px-2',
                      focused && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900'
                    )}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(-1)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    aria-current={active ? 'page' : undefined}
                    aria-label={collapsed ? `${item.name}: ${item.description}` : undefined}
                    tabIndex={0}
                  >
                    <div className={cn(
                      'flex-shrink-0 transition-colors duration-200',
                      active 
                        ? 'text-blue-700 dark:text-blue-400' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                    )}>
                      {item.icon}
                    </div>
                    
                    {!collapsed && (
                      <>
                        <span className="ml-3 flex-1 truncate">
                          {item.name}
                        </span>
                        
                        {item.badge && (
                          <span className={cn(
                            'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
                            typeof item.badge === 'number' || !isNaN(Number(item.badge))
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Active indicator */}
                    {active && (
                      <div className="absolute left-0 w-1 h-6 bg-blue-700 dark:bg-blue-400 rounded-r-full" />
                    )}
                  </Link>
                  
                  {/* Tooltip for collapsed state */}
                  {collapsed && hovered && (
                    <div className="fixed left-16 z-50 ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg pointer-events-none">
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs opacity-75 mt-1">{item.description}</div>
                      )}
                      {/* Tooltip arrow */}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                        <div className="border-4 border-transparent border-r-gray-900 dark:border-r-gray-100" />
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>© 2024 QTick MIS</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="System Online" />
            </div>
          )}
        </div>
      </nav>
    )
  }
)

SidebarNav.displayName = 'SidebarNav'

export { SidebarNav }