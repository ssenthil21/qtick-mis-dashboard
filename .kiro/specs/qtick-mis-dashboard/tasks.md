# Implementation Plan

- [x] 1. Initialize Next.js project and configure core dependencies





  - Create Next.js 14+ project with TypeScript and App Router
  - Install and configure Tailwind CSS with dark mode class strategy
  - Install chart.js, react-chartjs-2, and next-themes dependencies
  - Set up ESLint and Prettier configuration
  - _Requirements: 1.1, 10.1, 10.2, 15.1_

- [x] 2. Create TypeScript domain models and seed data



  - Define Client, User, FeatureUsage, StaffStat interfaces in types/domain.ts
  - Create FilterState and SortConfig types for table functionality
  - Implement seed data in lib/seed.ts with clients, users, and industry averages
  - Create health score calculation utility in lib/health.ts
  - _Requirements: 3.5, 4.1, 5.4, 9.2_

- [x] 3. Set up root layout with theme provider and global styles










  - Create app/layout.tsx with ThemeProvider from next-themes
  - Configure Tailwind CSS classes for gradients, animations, and responsive design
  - Set up global CSS with custom utility classes from original HTML
  - Implement theme persistence and class-based dark mode switching
  - _Requirements: 10.1, 10.2, 10.3, 11.3_

- [ ] 4. Build core UI components and design system
- [x] 4.1 Create reusable Badge component with health score styling



  - Implement Badge component with Green/Yellow/Red color variants
  - Add proper styling for status badges (Paid/Trial/Free Tier)
  - Include hover effects and accessibility attributes
  - _Requirements: 3.5, 6.2_

- [x] 4.2 Create KpiCard component with gradient backgrounds and animations



  - Implement gradient KPI cards with hover scale and elevation effects
  - Add tooltip functionality for additional context
  - Include change indicators with color coding
  - Support theme-aware styling for dark mode
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 4.3 Create Toast notification system



  - Implement Toast component with fade-in/out animations
  - Create Toaster context and provider for global toast management
  - Add auto-dismiss functionality with configurable duration
  - Include aria-live region for screen reader accessibility
  - _Requirements: 12.3, 12.4, 14.4_

- [ ] 5. Implement navigation and layout components
- [x] 5.1 Create SidebarNav component with route highlighting



  - Build desktop sidebar navigation with route-based active states
  - Implement smooth hover animations and accessibility support
  - Add responsive collapse functionality for mobile screens
  - Include proper ARIA labels and keyboard navigation
  - _Requirements: 11.3, 14.1, 14.2_

- [x] 5.2 Create HeaderBar component with search and controls




  - Implement dynamic page title based on current route
  - Add global search input with real-time filtering
  - Create theme toggle button with immediate UI updates
  - Build notifications panel trigger with animation states
  - _Requirements: 2.1, 10.1, 12.1, 12.2_

- [x] 5.3 Create MobileNav component for responsive navigation




  - Implement fixed bottom navigation bar for mobile devices
  - Add horizontal scroll functionality with hidden scrollbars
  - Ensure touch-friendly tap targets and smooth interactions
  - _Requirements: 11.1, 11.2, 11.4_

- [ ] 6. Build filtering and search functionality
- [x] 6.1 Create Filters component with date, industry, and status controls



  - Implement multi-select filters for industries and statuses
  - Add date range picker for KPI calculations
  - Create health score filter with color-coded options
  - Include Reset button to clear all filters
  - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6_

- [x] 6.2 Implement search and filter logic utilities




  - Create search filtering function for client name and ID
  - Implement filter application logic for all filter types
  - Add date range multiplier calculations for KPI updates
  - Create memoized filtering to prevent performance issues
  - _Requirements: 2.1, 2.6, 15.2_

- [ ] 7. Create sortable and filterable client table
- [x] 7.1 Build ClientTable component with sorting functionality




  - Implement sortable table headers with click handlers
  - Add ascending/descending toggle with visual chevron indicators
  - Create skeleton loading rows with smooth transitions
  - Include row click handlers for client selection
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1_

- [x] 7.2 Integrate search, filtering, and health score display



  - Connect search input to real-time table filtering
  - Apply all filter types to table data display
  - Implement health score calculation and badge display
  - Add smooth scroll-to-view for selected client details
  - _Requirements: 2.1, 3.5, 4.2_

- [ ] 8. Implement client deep-dive analytics section
- [x] 8.1 Create ClientDeepDive component with tabbed interface



  - Build overview and notes tabs with smooth switching
  - Display client-specific KPI cards and metrics
  - Show feature usage breakdown as organized list
  - Include action buttons for client management
  - _Requirements: 4.2, 4.3, 4.4, 4.6_

- [x] 8.2 Add charts to client deep-dive section



  - Implement monthly jobs bar chart with theme-aware colors
  - Create new vs repeat customers doughnut chart
  - Use dynamic imports to prevent SSR issues
  - Add chart destruction/recreation on theme changes
  - _Requirements: 4.5, 10.3, 15.1_

- [ ] 9. Build chart components with theme support
- [x] 9.1 Create base chart components with dynamic imports



  - Implement BarChart, PieChart, DoughnutChart, and RadarChart wrappers
  - Use next/dynamic to prevent SSR issues with chart.js
  - Add loading states and error boundaries for chart failures
  - Include theme-aware color schemes for all chart types
  - _Requirements: 10.3, 15.1_

- [x] 9.2 Implement chart theme switching and data updates



  - Create theme-aware color palettes for light and dark modes
  - Implement chart destruction and recreation on theme changes
  - Add smooth data transitions and loading states
  - Ensure proper cleanup to prevent memory leaks
  - _Requirements: 10.1, 10.3, 15.3_

- [ ] 10. Create dashboard page with KPIs and client management
- [x] 10.1 Build main dashboard page layout and KPI section

  - Implement dashboard page with KPI cards for key metrics
  - Calculate total clients, active subscriptions, monthly revenue, and health scores
  - Apply date filter multipliers to KPI calculations
  - Add responsive layout for mobile devices
  - _Requirements: 1.1, 1.2, 11.4_

- [x] 10.2 Integrate client table and deep-dive functionality

  - Connect ClientTable component with search and filtering
  - Implement client selection and deep-dive display
  - Add smooth scroll animation when client is selected
  - Ensure all filtering and sorting works correctly
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1, 4.2_

- [ ] 11. Build analytics page with revenue and benchmarking
- [x] 11.1 Create analytics page with revenue metrics and charts



  - Calculate and display total revenue, ARPC, and LTV
  - Implement revenue by industry pie chart
  - Create feature adoption horizontal bar chart
  - Add responsive layout and theme support
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 11.2 Implement client benchmarking functionality



  - Create client selector for benchmarking comparison
  - Display retention, review, and job growth metrics vs industry averages
  - Implement radar chart for multi-dimensional comparison
  - Add smooth transitions when switching selected clients
  - _Requirements: 5.4, 5.5_

- [x] 12. Create CRM page with segmentation and campaigns



  - Implement client segmentation KPI cards (loyal, at-risk, new)
  - Display campaign statistics matching original HTML structure
  - Add actionable insights for each client segment
  - Ensure responsive design and theme compatibility
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 13. Build Live Ops page with real-time activity feed



  - Create simulated activity feed with 2-second intervals
  - Implement activity list with 50-item maximum limit
  - Add pulse animation for new activity insertions
  - Pause activity generation when page is not visible
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 14. Create Reports page with builder and history



  - Implement report builder controls interface
  - Display recent reports list with proper formatting
  - Add intuitive controls for report configuration
  - Ensure responsive design across all screen sizes
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 15. Build Admin page with user management
- [x] 15.1 Create users table with role management



  - Display users table with color-coded role chips
  - Implement proper table formatting and responsive design
  - Add user management controls and actions
  - _Requirements: 9.1, 9.2, 9.4_

- [x] 15.2 Add user creation modal functionality



  - Create "Add New User" modal with form interface
  - Implement modal animations and accessibility features
  - Add form validation and submission handling
  - Connect to toast notifications for user feedback
  - _Requirements: 9.3, 13.3_

- [x] 16. Create GA4 Analytics page



  - Implement GA4-specific analytics tiles and metrics
  - Create top pages table with proper data display
  - Add responsive design and theme support
  - Ensure consistent styling with other analytics pages
  - _Requirements: 5.1_

- [ ] 17. Implement modal system with animations
- [x] 17.1 Create base Modal component with accessibility

  - Build reusable Modal component with overlay and content animations
  - Implement focus trap and keyboard navigation support
  - Add Escape key and overlay click to close functionality
  - Include proper ARIA attributes and screen reader support
  - _Requirements: 13.1, 13.2, 14.2, 14.3_

- [x] 17.2 Create specific modal components



  - Implement OnboardingModal with client onboarding form
  - Create RenewalModal for subscription renewal process
  - Build UserModal for user creation and editing
  - Add form validation and submission handling to all modals
  - _Requirements: 13.3_

- [x] 18. Implement notifications panel with animations



  - Create notifications panel with toggle functionality
  - Add smooth transform and opacity transitions
  - Implement outside click detection for panel closing
  - Include proper accessibility attributes and focus management
  - _Requirements: 12.1, 12.2, 14.2_

- [ ] 19. Add comprehensive accessibility features
- [x] 19.1 Implement keyboard navigation and focus management



  - Add visible focus rings to all interactive elements
  - Implement proper tab order throughout the application
  - Add keyboard shortcuts for common actions
  - Test and fix any keyboard navigation issues
  - _Requirements: 14.1_

- [ ] 19.2 Add ARIA labels and screen reader support


  - Add appropriate ARIA labels to all interactive elements
  - Implement aria-expanded for collapsible elements
  - Add role attributes for custom components
  - Test with screen reader software and fix issues
  - _Requirements: 14.2, 14.3, 14.4_

- [ ] 20. Optimize performance and add loading states
- [x] 20.1 Implement skeleton loading components



  - Create TableSkeleton component for table loading states
  - Build ChartSkeleton components for different chart types
  - Add smooth transitions from loading to actual content
  - Ensure theme-aware styling for all skeleton components
  - _Requirements: 3.4, 15.4_

- [x] 20.2 Add performance optimizations



  - Implement memoization for expensive calculations
  - Add debouncing to search input (150ms delay)
  - Optimize chart rendering and memory usage
  - Add throttling for live feed updates
  - _Requirements: 15.2, 15.3, 15.5_

- [x] 21. Final integration testing and polish





- [x] 21.1 Test all page navigation and routing


  - Verify all routes work correctly with App Router
  - Test active state highlighting in navigation
  - Ensure smooth transitions between pages
  - Verify mobile navigation functionality
  - _Requirements: 11.1, 11.3, 11.4_

- [x] 21.2 Test theme switching across all components


  - Verify theme persistence across browser sessions
  - Test immediate updates of all UI elements on theme change
  - Ensure charts update colors correctly when theme changes
  - Test theme switching on all pages and components
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 21.3 Verify accessibility compliance and performance


  - Run Lighthouse accessibility audit (target: 90+ score)
  - Test keyboard navigation on all pages
  - Verify screen reader compatibility
  - Check for console errors and performance issues
  - _Requirements: 14.5, 15.5_