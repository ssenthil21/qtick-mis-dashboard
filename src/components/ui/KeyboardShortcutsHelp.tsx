'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'

interface KeyboardShortcut {
  key: string
  modifiers: {
    ctrl?: boolean
    alt?: boolean
    shift?: boolean
    meta?: boolean
  }
  description: string
}

const shortcuts: KeyboardShortcut[] = [
  {
    key: 'D',
    modifiers: { alt: true },
    description: 'Go to Dashboard'
  },
  {
    key: 'A',
    modifiers: { alt: true },
    description: 'Go to Analytics'
  },
  {
    key: 'C',
    modifiers: { alt: true },
    description: 'Go to CRM'
  },
  {
    key: 'R',
    modifiers: { alt: true },
    description: 'Go to Reports'
  },
  {
    key: 'L',
    modifiers: { alt: true },
    description: 'Go to Live Ops'
  },
  {
    key: 'M',
    modifiers: { alt: true },
    description: 'Go to Admin'
  },
  {
    key: 'S',
    modifiers: { alt: true },
    description: 'Toggle sidebar'
  },
  {
    key: 'K',
    modifiers: { ctrl: true },
    description: 'Focus search'
  },
  {
    key: '/',
    modifiers: { ctrl: true },
    description: 'Focus search'
  },
  {
    key: 'Escape',
    modifiers: {},
    description: 'Close modals/panels or blur search'
  },
  {
    key: '?',
    modifiers: { shift: true },
    description: 'Show this help'
  }
]

function formatShortcut(shortcut: KeyboardShortcut): string {
  const modifierKeys = []
  if (shortcut.modifiers.ctrl) modifierKeys.push('Ctrl')
  if (shortcut.modifiers.alt) modifierKeys.push('Alt')
  if (shortcut.modifiers.shift) modifierKeys.push('Shift')
  if (shortcut.modifiers.meta) modifierKeys.push('Cmd')
  
  return [...modifierKeys, shortcut.key].join(' + ')
}

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
        // Don't trigger if typing in an input
        const target = event.target as HTMLElement
        const isInputElement = target.tagName === 'INPUT' || 
                              target.tagName === 'TEXTAREA' || 
                              target.contentEditable === 'true'
        
        if (!isInputElement) {
          event.preventDefault()
          setIsOpen(true)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Keyboard Shortcuts"
      size="md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use these keyboard shortcuts to navigate the application quickly.
        </p>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-900 dark:text-white">
                {shortcut.description}
              </span>
              <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-mono rounded border border-gray-300 dark:border-gray-600">
                {formatShortcut(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Escape</kbd> to close this dialog.
          </p>
        </div>
      </div>
    </Modal>
  )
}