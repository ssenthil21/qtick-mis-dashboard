import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ToasterProvider } from '@/components/ui/Toaster'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'QTick MIS Dashboard',
  description: 'Business intelligence and management system for client operations, analytics, and administrative controls',
  keywords: ['dashboard', 'business intelligence', 'analytics', 'CRM', 'management'],
  authors: [{ name: 'QTick' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body 
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased transition-colors duration-200`} 
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
          storageKey="qtick-theme"
        >
          <ToasterProvider position="top-right" maxToasts={5}>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
          </ToasterProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}