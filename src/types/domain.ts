// Core domain interfaces for the QTick MIS Dashboard

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'Paid' | 'Trial' | 'Free Tier';
  monthlyJobs: number;
  walkIns: number;
  appointments: number;
  totalReviews: number;
  totalRevenue: number;
  healthScore: number;
  joinDate: string;
  lastActivity: string;
  subscriptionEndDate: string;
  features: FeatureUsage[];
  staff: StaffStat[];
  notes?: string;
  contactEmail?: string;
  phoneNumber?: string;
  accountManager: string;
  newCustomers: number;
  repeatCustomers: number;
  averageReview: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Analyst' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
}

export interface FeatureUsage {
  featureName: string;
  usageCount: number;
  lastUsed: string;
  adoptionRate: number; // percentage
  category: 'Core' | 'Advanced' | 'Premium';
}

export interface StaffStat {
  staffId: string;
  name: string;
  role: string;
  jobsCompleted: number;
  efficiency: number; // percentage
  customerRating: number; // 1-5 scale
  activeHours: number;
}

export interface IndustryAverage {
  industry: string;
  averageRetention: number;
  averageReviews: number;
  averageJobGrowth: number;
  averageHealthScore: number;
  averageRevenue: number;
}

// Filter and sorting types
export interface FilterState {
  search: string;
  industries: string[];
  statuses: ('Paid' | 'Trial' | 'Free Tier')[];
  healthScores: ('Good' | 'Warning' | 'Critical')[];
  dateRange: {
    start: string;
    end: string;
  };
}

export interface SortConfig {
  key: keyof Client | 'healthScore' | null;
  direction: 'asc' | 'desc';
}

// Dashboard KPI types
export interface KpiMetric {
  label: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
  gradient: 'blue' | 'green' | 'purple' | 'orange';
}

// Activity feed types
export interface Activity {
  id: string;
  type: 'client_signup' | 'payment_received' | 'feature_used' | 'support_ticket' | 'renewal';
  message: string;
  timestamp: string;
  clientId?: string;
  clientName?: string;
  metadata?: Record<string, any>;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Report types
export interface Report {
  id: string;
  name: string;
  type: 'Revenue' | 'Client Health' | 'Feature Usage' | 'Staff Performance';
  createdAt: string;
  createdBy: string;
  status: 'Generated' | 'Processing' | 'Failed';
  downloadUrl?: string;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Campaign types for CRM
export interface Campaign {
  id: string;
  name: string;
  type: 'Email' | 'SMS' | 'Push';
  status: 'Active' | 'Paused' | 'Completed';
  targetSegment: 'Loyal' | 'At Risk' | 'New';
  sentCount: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
}

export type LeadStage =
  | 'new_lead'
  | 'contacted'
  | 'demo_scheduled'
  | 'trial_started'
  | 'converted'
  | 'lost';

export interface Lead {
  id: string;
  businessName: string;
  leadSource: 'Website' | 'Referral' | 'Cold Call' | 'Other';
  estimatedDealSize: number;
  lastContactDate: string;
  assignedTo: string;
  stage: LeadStage;
  contactPerson?: string;
  email?: string;
  phone?: string;
  expectedCloseDate?: string;
  activity: { date: string; note: string; type: string }[];
  nextStep?: string;
  nextStepDue?: string;
}