'use client'

import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NotificationsPanel } from '@/components/ui/NotificationsPanel'

interface HeaderBarProps {
  title?: string
  showSearch?: boolean
  onSearchChange?: (value: string) => void
  searchValue?: string
}

const getPageTitle = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/': 'QTick MIS Dashboard',
    '/analytics': 'Analytics',
    '/ga4-analytics': 'GA4 Analytics',
    '/crm': 'CRM',
    '/live-ops': 'Live Ops',
    '/admin': 'Admin',
    '/reports': 'Reports'
  }
  
  return routes[pathname] || 'QTick MIS Dashboard'
}

export function HeaderBar({ 
  title, 
  showSearch = true, 
  onSearchChange,
  searchValue = ''
}: HeaderBarProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchValue)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setSearchTerm(searchValue)
  }, [searchValue])

  const pageTitle = title || getPageTitle(pathname)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearchChange?.(value)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const closeNotifications = () => {
    setShowNotifications(false)
  }

  if (!mounted) {
    return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center space-x-4">
          {/* Global Search */}
          {showSearch && (
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg 
                  className="h-5 w-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors focus-ring"
                aria-label="Search clients"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Use Ctrl+K or Ctrl+/ to focus this search field
              </div>
            </div>
          )}

          {/* Mobile Search */}
          {showSearch && (
            <button
              className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors"
              aria-label="Search"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          )}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors focus-ring"
              aria-label="Notifications"
              aria-expanded={showNotifications}
              aria-haspopup="dialog"
            >
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>

            {/* Notifications Panel */}
            <NotificationsPanel
              isOpen={showNotifications}
              onClose={closeNotifications}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md transition-colors focus-ring"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                />
              </svg>
            ) : (
              <svg 
                className="h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}