'use client'

import React, { useState, useEffect } from 'react'
import { SidebarNav } from './SidebarNav'
import { HeaderBar } from './HeaderBar'
import { MobileNav } from './MobileNav'
import { SkipLinks } from '@/components/ui/SkipLink'
import { KeyboardShortcutsHelp } from '@/components/ui/KeyboardShortcutsHelp'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { cn } from '@/lib/utils'

export interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  title?: string
  showSearch?: boolean
  onSearchChange?: (value: string) => void
  searchValue?: string
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ children, className, title, showSearch, onSearchChange, searchValue }, ref) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const toggleSidebar = () => {
      setSidebarCollapsed(!sidebarCollapsed)
    }
    
    // Initialize keyboard navigation
    useKeyboardNavigation({
      enableGlobalShortcuts: true,
      shortcuts: [
        {
          key: 's',
          altKey: true,
          action: toggleSidebar,
          description: 'Toggle sidebar (Alt+S)'
        }
      ]
    })

    useEffect(() => {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        if (mobile) {
          setSidebarCollapsed(true)
        }
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
      <div ref={ref} className={cn('flex h-screen bg-gray-50 dark:bg-gray-900', className)}>
        {/* Skip Links for accessibility */}
        <SkipLinks />
        
        {/* Sidebar */}
        <aside 
          id="navigation"
          className={cn(
            'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out',
            'md:relative md:translate-x-0 md:flex-shrink-0',
            isMobile && sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          <SidebarNav 
            collapsed={sidebarCollapsed} 
            onToggleCollapse={toggleSidebar}
          />
        </aside>

        {/* Mobile overlay */}
        {isMobile && !sidebarCollapsed && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Bar */}
          <div className="relative">
            {/* Mobile header for sidebar toggle */}
            {isMobile && (
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 md:hidden">
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Open sidebar"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">QTick MIS</h1>
                <div className="w-10" /> {/* Spacer for centering */}
              </div>
            )}
            
            {/* Desktop Header Bar */}
            <div className="hidden md:block" id="search">
              <HeaderBar 
                title={title}
                showSearch={showSearch}
                onSearchChange={onSearchChange}
                searchValue={searchValue}
              />
            </div>
          </div>

          {/* Page content */}
          <div 
            id="main-content"
            className={cn(
              'flex-1 overflow-auto focus-ring',
              isMobile ? 'pb-16' : '' // Add bottom padding for mobile nav
            )}
            tabIndex={-1}
          >
            {children}
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
        
        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp />
      </div>
    )
  }
)

DashboardLayout.displayName = 'DashboardLayout'

export { DashboardLayout }