# Design Document

## Overview

The QTick MIS Dashboard will be built as a modern Next.js 14+ application using the App Router architecture with TypeScript and Tailwind CSS. The application follows a component-based architecture with clear separation of concerns, leveraging React's state management capabilities and modern web standards for accessibility and performance.

The system is designed as a single-page application with multiple routes, featuring a persistent layout with sidebar navigation, header controls, and responsive mobile navigation. All data is currently managed in-memory using seed data, with the architecture designed to easily integrate with backend APIs in the future.

## Architecture

### Application Structure

```
/app
├── layout.tsx                 # Root layout with providers and global components
├── (dashboard)
│   ├── dashboard/page.tsx     # Main dashboard with KPIs and client table
│   ├── analytics/page.tsx     # Revenue analytics and benchmarking
│   ├── ga4-analytics/page.tsx # GA4 specific analytics
│   ├── crm/page.tsx          # Client segmentation and campaigns
│   ├── live-ops/page.tsx     # Real-time activity feed
│   ├── admin/page.tsx        # User management
│   └── reports/page.tsx      # Report builder and history
└── api/                      # Future API routes (placeholder)

/components
├── layout/
│   ├── SidebarNav.tsx        # Desktop navigation
│   ├── MobileNav.tsx         # Mobile bottom navigation
│   └── HeaderBar.tsx         # Page header with controls
├── dashboard/
│   ├── KpiCard.tsx           # Gradient KPI tiles
│   ├── Filters.tsx           # Date/industry/status filters
│   ├── ClientTable.tsx       # Sortable client data table
│   └── ClientDeepDive.tsx    # Detailed client analytics
├── charts/
│   ├── BarChart.tsx          # Bar chart wrapper
│   ├── DoughnutChart.tsx     # Doughnut chart wrapper
│   ├── PieChart.tsx          # Pie chart wrapper
│   └── RadarChart.tsx        # Radar chart wrapper
├── modals/
│   ├── OnboardingModal.tsx   # Client onboarding
│   ├── RenewalModal.tsx      # Subscription renewal
│   └── UserModal.tsx         # User management
├── ui/
│   ├── Toast.tsx             # Toast notification component
│   ├── Toaster.tsx           # Toast container
│   ├── Badge.tsx             # Status badges
│   ├── EntityCard.tsx        # Reusable card component
│   └── Legend.tsx            # Chart legend component
└── providers/
    └── ThemeProvider.tsx     # Theme context provider

/lib
├── seed.ts                   # Static data for development
├── health.ts                 # Health score calculations
├── utils.ts                  # Utility functions
└── constants.ts              # Application constants

/types
└── domain.ts                 # TypeScript type definitions
```

### Technology Stack

- **Framework**: Next.js 14+ with App Router for modern React patterns and file-based routing
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Tailwind CSS with class-based dark mode strategy
- **Charts**: react-chartjs-2 with chart.js/auto for comprehensive charting capabilities
- **Theme Management**: next-themes for persistent theme switching
- **State Management**: React state with Context API for global state when needed
- **Icons**: Inline SVG elements extracted from original HTML (no external dependencies)

## Components and Interfaces

### Core Layout Components

#### SidebarNav Component
```typescript
interface SidebarNavProps {
  className?: string;
}

// Features:
// - Route-based active state highlighting
// - Responsive collapse on mobile
// - Smooth hover animations
// - Accessibility support with proper ARIA labels
```

#### HeaderBar Component
```typescript
interface HeaderBarProps {
  title: string;
  showSearch?: boolean;
}

// Features:
// - Dynamic page title based on current route
// - Global search functionality
// - Theme toggle button
// - Notifications panel trigger
// - Responsive design for mobile
```

#### MobileNav Component
```typescript
interface MobileNavProps {
  className?: string;
}

// Features:
// - Fixed bottom positioning
// - Horizontal scroll for overflow
// - Hidden scrollbars
// - Touch-friendly tap targets
```

### Dashboard Components

#### KpiCard Component
```typescript
interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  gradient: string;
  tooltip?: string;
  icon?: React.ReactNode;
}

// Features:
// - Gradient backgrounds with hover animations
// - Optional tooltips for additional context
// - Change indicators with color coding
// - Smooth scale and elevation effects
```

#### ClientTable Component
```typescript
interface ClientTableProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  searchTerm: string;
  filters: FilterState;
  sortConfig: SortConfig;
  onSort: (key: keyof Client) => void;
}

// Features:
// - Real-time search filtering
// - Multi-column sorting with visual indicators
// - Health score badges with color coding
// - Skeleton loading states
// - Row click handlers for deep-dive
```

#### ClientDeepDive Component
```typescript
interface ClientDeepDiveProps {
  client: Client | null;
  onClose: () => void;
}

// Features:
// - Tabbed interface (Overview/Notes)
// - KPI cards specific to selected client
// - Feature usage breakdown
// - Interactive charts (bar and doughnut)
// - Action buttons for client management
// - Smooth scroll-into-view animation
```

### Chart Components

All chart components use dynamic imports to prevent SSR issues and support theme-aware styling:

```typescript
interface ChartProps {
  data: ChartData;
  options?: ChartOptions;
  className?: string;
}

// Common features across all charts:
// - Dynamic import with SSR disabled
// - Theme-aware color schemes
// - Responsive sizing
// - Chart destruction/recreation on theme change
// - Loading states during data updates
```

### Modal System

#### Modal Architecture
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Features:
// - Overlay with fade animation
// - Content slide-in animation
// - Focus trap for accessibility
// - Escape key and overlay click to close
// - Portal rendering for proper z-index stacking
```

### Toast Notification System

```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ToasterContextValue {
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}

// Features:
// - Queue-based toast management
// - Auto-dismiss with configurable duration
// - Fade-in/out animations
// - Stacking with proper spacing
// - aria-live region for screen readers
```

## Data Models

### Core Domain Types

```typescript
export interface Client {
  id: string;
  name: string;
  industry: 'Saloon' | 'Spa' | 'Turf Club' | 'Clinics' | 'Laundry Shop' | 'Food Truck';
  status: 'Paid' | 'Trial' | 'Free Tier';
  jobsThisMonth: number;
  lastBillDate: string;
  subscriptionEndDate: string | 'N/A';
  totalRevenue: number;
  totalTokens: number;
  avgReview: number;
  newCustomers: number;
  repeatCustomers: number;
  staff: StaffStat[];
  jobGrowth: number;
  totalReviews: number;
  retentionRate: number;
  featureUsage: FeatureUsage;
}

export interface FeatureUsage {
  billing: number;
  appointments: number;
  loyalty: number;
  reviews: number;
  billAmend: number;
  profileMgmt: number;
  reporting: number;
  campaigns: number;
}

export interface StaffStat {
  name: string;
  jobs: number;
  revenue: number;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  createdAt: string;
  lastLogin: string;
}

export interface FilterState {
  industries: string[];
  statuses: string[];
  healthScores: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface SortConfig {
  key: keyof Client | null;
  direction: 'asc' | 'desc';
}
```

### Health Score Calculation

```typescript
export function calculateHealthScore(client: Client): {
  score: 'Green' | 'Yellow' | 'Red';
  label: string;
} {
  const daysSinceLastBill = Math.floor(
    (Date.now() - new Date(client.lastBillDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceLastBill <= 30 && client.jobsThisMonth >= 10) {
    return { score: 'Green', label: 'Healthy' };
  } else if (daysSinceLastBill <= 60 && client.jobsThisMonth >= 5) {
    return { score: 'Yellow', label: 'At Risk' };
  } else {
    return { score: 'Red', label: 'Critical' };
  }
}
```

## Error Handling

### Client-Side Error Boundaries

```typescript
// Global error boundary for unhandled React errors
export class GlobalErrorBoundary extends React.Component {
  // Catches and displays user-friendly error messages
  // Logs errors for debugging
  // Provides fallback UI
}

// Chart-specific error handling
export function ChartErrorBoundary({ children }: { children: React.ReactNode }) {
  // Handles chart rendering failures
  // Shows placeholder when charts fail to load
  // Retries chart initialization
}
```

### Data Validation

```typescript
// Runtime type checking for API responses (future)
export function validateClient(data: unknown): Client {
  // Validates client data structure
  // Provides default values for missing fields
  // Throws descriptive errors for invalid data
}

// Health score validation
export function validateHealthScore(score: unknown): boolean {
  return ['Green', 'Yellow', 'Red'].includes(score as string);
}
```

### Loading States

```typescript
// Skeleton loading for tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  // Animated skeleton rows
  // Matches table structure
  // Smooth transition to actual data
}

// Chart loading states
export function ChartSkeleton({ type }: { type: 'bar' | 'pie' | 'doughnut' | 'radar' }) {
  // Chart-specific loading animations
  // Maintains layout during loading
  // Theme-aware styling
}
```

## Testing Strategy

### Unit Testing
- **Components**: Test rendering, props handling, and user interactions
- **Utilities**: Test health score calculations, data transformations, and filtering logic
- **Hooks**: Test custom hooks for theme management and data fetching

### Integration Testing
- **Page Rendering**: Test complete page renders with all components
- **Navigation**: Test routing and active state management
- **Theme Switching**: Test theme persistence and chart updates
- **Modal Interactions**: Test modal opening, closing, and form submissions

### Accessibility Testing
- **Keyboard Navigation**: Test all interactive elements with keyboard-only navigation
- **Screen Reader**: Test with screen reader software for proper ARIA implementation
- **Color Contrast**: Automated testing for WCAG compliance in both themes
- **Focus Management**: Test focus trapping in modals and proper focus indicators

### Performance Testing
- **Chart Rendering**: Test chart performance with large datasets
- **Table Sorting**: Test sorting performance with maximum client data
- **Memory Usage**: Monitor for memory leaks in live feed updates
- **Bundle Size**: Monitor JavaScript bundle size and loading performance

### Visual Regression Testing
- **Theme Consistency**: Screenshot testing for both light and dark themes
- **Responsive Design**: Test layouts across different screen sizes
- **Animation States**: Test hover states and transitions
- **Chart Rendering**: Visual testing for chart accuracy and styling

## Performance Considerations

### Code Splitting
- Dynamic imports for chart components to reduce initial bundle size
- Route-based code splitting through Next.js App Router
- Lazy loading for modal components

### State Management Optimization
- Memoization of expensive calculations (health scores, filtered data)
- Debounced search input to prevent excessive filtering
- Virtualization for large data tables (future enhancement)

### Chart Performance
- Chart instance reuse where possible
- Throttled updates for real-time data
- Canvas-based rendering for better performance with large datasets

### Mobile Optimization
- Touch-friendly tap targets (minimum 44px)
- Optimized animations for mobile devices
- Reduced motion support for accessibility preferences

This design provides a solid foundation for building a production-ready dashboard application that meets all the specified requirements while maintaining excellent performance, accessibility, and user experience standards.