'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  className?: string
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    name: 'GA4',
    href: '/ga4-analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    name: 'CRM',
    href: '/crm',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    name: 'Live Ops',
    href: '/live-ops',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
]

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav 
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden',
        'safe-area-inset-bottom', // Handle iPhone notch/home indicator
        className
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {/* Horizontal scrollable container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max px-2 py-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center min-w-0 flex-shrink-0 px-3 py-2 mx-1 rounded-lg transition-all duration-200 ease-in-out',
                  'touch-manipulation', // Optimize for touch
                  'min-h-[44px] min-w-[44px]', // Touch-friendly minimum size
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 scale-105'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex-shrink-0 mb-1">
                  {item.icon}
                </div>
                <span className="text-xs font-medium truncate max-w-[60px] leading-tight">
                  {item.name}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Scroll indicator shadows */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none" />
    </nav>
  )
}