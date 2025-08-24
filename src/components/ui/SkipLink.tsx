'use client'

interface SkipLinkProps {
  href: string
  children: React.ReactNode
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="skip-link"
      onFocus={(e) => {
        // Ensure the target element exists and is focusable
        const target = document.querySelector(href) as HTMLElement
        if (target) {
          target.tabIndex = -1
        }
      }}
    >
      {children}
    </a>
  )
}

export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#search">Skip to search</SkipLink>
    </>
  )
}