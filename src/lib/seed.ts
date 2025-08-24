import { Client, User, IndustryAverage, FeatureUsage, StaffStat, Activity, Report, Notification, Campaign } from '@/types/domain';

// Sample feature usage data
const sampleFeatures: FeatureUsage[] = [
  {
    featureName: 'Job Scheduling',
    usageCount: 245,
    lastUsed: '2025-08-23T08:30:00Z',
    adoptionRate: 95,
    category: 'Core'
  },
  {
    featureName: 'Customer Reviews',
    usageCount: 189,
    lastUsed: '2025-08-22T16:45:00Z',
    adoptionRate: 78,
    category: 'Core'
  },
  {
    featureName: 'Analytics Dashboard',
    usageCount: 156,
    lastUsed: '2025-08-23T09:15:00Z',
    adoptionRate: 65,
    category: 'Advanced'
  },
  {
    featureName: 'AI Recommendations',
    usageCount: 89,
    lastUsed: '2025-08-21T14:20:00Z',
    adoptionRate: 42,
    category: 'Premium'
  },
  {
    featureName: 'Mobile App',
    usageCount: 312,
    lastUsed: '2025-08-23T10:00:00Z',
    adoptionRate: 88,
    category: 'Core'
  }
];

// Sample staff statistics
const sampleStaff: StaffStat[] = [
  {
    staffId: 'staff-001',
    name: 'John Smith',
    role: 'Senior Technician',
    jobsCompleted: 45,
    efficiency: 92,
    customerRating: 4.8,
    activeHours: 160
  },
  {
    staffId: 'staff-002',
    name: 'Sarah Johnson',
    role: 'Customer Service',
    jobsCompleted: 38,
    efficiency: 87,
    customerRating: 4.6,
    activeHours: 155
  },
  {
    staffId: 'staff-003',
    name: 'Mike Wilson',
    role: 'Field Manager',
    jobsCompleted: 52,
    efficiency: 94,
    customerRating: 4.9,
    activeHours: 165
  }
];

// Sample clients data
export const sampleClients: Client[] = [
  {
    id: 'client-001',
    name: "Bella's Beauty Salon",
    industry: 'Saloon',
    status: 'Paid',
    monthlyJobs: 145,
    totalRevenue: 125000,
    healthScore: 92,
    joinDate: '2024-03-15T00:00:00Z',
    lastActivity: '2025-08-23T09:30:00Z',
    subscriptionEndDate: '2025-12-15T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.8,
    features: sampleFeatures,
    staff: sampleStaff,
    notes: 'High-value client with excellent engagement. Considering premium features.',
    contactEmail: 'contact@bellasbeauty.com',
    phoneNumber: '+1-555-0123'
  },
  {
    id: 'client-002',
    name: 'Zen Spa Retreat',
    industry: 'Spa',
    status: 'Paid',
    monthlyJobs: 89,
    totalRevenue: 89000,
    healthScore: 78,
    joinDate: '2024-06-20T00:00:00Z',
    lastActivity: '2025-08-22T14:15:00Z',
    subscriptionEndDate: '2025-11-20T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.5,
    features: sampleFeatures.slice(0, 3),
    staff: sampleStaff.slice(0, 2),
    contactEmail: 'info@zenspa.com',
    phoneNumber: '+1-555-0124'
  },
  {
    id: 'client-003',
    name: 'Premier Health Clinic',
    industry: 'Clinics',
    status: 'Trial',
    monthlyJobs: 67,
    totalRevenue: 0,
    healthScore: 65,
    joinDate: '2025-07-10T00:00:00Z',
    lastActivity: '2025-08-21T11:45:00Z',
    subscriptionEndDate: '2025-09-10T00:00:00Z',
    newCustomer: true,
    repeatCustomer: false,
    averageReview: 4.2,
    features: sampleFeatures.slice(0, 2),
    staff: sampleStaff.slice(0, 1),
    notes: 'Trial client showing good engagement. Follow up on conversion.',
    contactEmail: 'admin@premierclinic.com'
  },
  {
    id: 'client-004',
    name: 'Elite Turf Club',
    industry: 'Turf Club',
    status: 'Paid',
    monthlyJobs: 234,
    totalRevenue: 187000,
    healthScore: 88,
    joinDate: '2024-01-08T00:00:00Z',
    lastActivity: '2025-08-23T07:20:00Z',
    subscriptionEndDate: '2026-01-08T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.7,
    features: sampleFeatures,
    staff: sampleStaff,
    contactEmail: 'operations@eliteturf.com',
    phoneNumber: '+1-555-0125'
  },
  {
    id: 'client-005',
    name: 'Quick Clean Laundry',
    industry: 'Laundry Shop',
    status: 'Free Tier',
    monthlyJobs: 23,
    totalRevenue: 0,
    healthScore: 45,
    joinDate: '2025-08-01T00:00:00Z',
    lastActivity: '2025-08-20T16:30:00Z',
    subscriptionEndDate: '2025-09-01T00:00:00Z',
    newCustomer: true,
    repeatCustomer: false,
    averageReview: 3.8,
    features: sampleFeatures.slice(0, 1),
    staff: [],
    notes: 'New free tier user. Low engagement, needs onboarding support.',
    contactEmail: 'info@quickclean.com'
  },
  {
    id: 'client-006',
    name: 'Gourmet Food Truck',
    industry: 'Food Truck',
    status: 'Paid',
    monthlyJobs: 178,
    totalRevenue: 156000,
    healthScore: 85,
    joinDate: '2024-04-12T00:00:00Z',
    lastActivity: '2025-08-23T08:45:00Z',
    subscriptionEndDate: '2025-10-12T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.6,
    features: sampleFeatures.slice(0, 4),
    staff: sampleStaff,
    contactEmail: 'orders@gourmetfoodtruck.com',
    phoneNumber: '+1-555-0126'
  },
  {
    id: 'client-007',
    name: 'Luxury Spa & Wellness',
    industry: 'Spa',
    status: 'Trial',
    monthlyJobs: 45,
    totalRevenue: 0,
    healthScore: 72,
    joinDate: '2025-07-25T00:00:00Z',
    lastActivity: '2025-08-22T13:10:00Z',
    subscriptionEndDate: '2025-09-25T00:00:00Z',
    newCustomer: true,
    repeatCustomer: false,
    averageReview: 4.4,
    features: sampleFeatures.slice(0, 3),
    staff: sampleStaff.slice(0, 2),
    notes: 'Luxury spa with potential for premium features.',
    contactEmail: 'info@luxuryspa.com'
  },
  {
    id: 'client-008',
    name: 'Downtown Hair Studio',
    industry: 'Saloon',
    status: 'Paid',
    monthlyJobs: 312,
    totalRevenue: 248000,
    healthScore: 94,
    joinDate: '2023-11-30T00:00:00Z',
    lastActivity: '2025-08-23T10:15:00Z',
    subscriptionEndDate: '2025-11-30T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.9,
    features: sampleFeatures,
    staff: sampleStaff,
    contactEmail: 'booking@downtownhair.com',
    phoneNumber: '+1-555-0127'
  },
  {
    id: 'client-009',
    name: 'Family Medical Center',
    industry: 'Clinics',
    status: 'Paid',
    monthlyJobs: 156,
    totalRevenue: 132000,
    healthScore: 81,
    joinDate: '2024-05-18T00:00:00Z',
    lastActivity: '2025-08-23T11:20:00Z',
    subscriptionEndDate: '2025-12-18T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.3,
    features: sampleFeatures.slice(0, 4),
    staff: sampleStaff.slice(0, 2),
    contactEmail: 'admin@familymedical.com',
    phoneNumber: '+1-555-0128'
  },
  {
    id: 'client-010',
    name: 'Green Valley Turf',
    industry: 'Turf Club',
    status: 'Free Tier',
    monthlyJobs: 34,
    totalRevenue: 0,
    healthScore: 52,
    joinDate: '2025-06-15T00:00:00Z',
    lastActivity: '2025-08-19T15:30:00Z',
    subscriptionEndDate: '2025-09-15T00:00:00Z',
    newCustomer: true,
    repeatCustomer: false,
    averageReview: 3.9,
    features: sampleFeatures.slice(0, 2),
    staff: sampleStaff.slice(0, 1),
    notes: 'Small turf club, considering upgrade to paid plan.',
    contactEmail: 'info@greenvalleyturf.com'
  },
  {
    id: 'client-011',
    name: 'Express Wash & Fold',
    industry: 'Laundry Shop',
    status: 'Trial',
    monthlyJobs: 78,
    totalRevenue: 0,
    healthScore: 68,
    joinDate: '2025-07-05T00:00:00Z',
    lastActivity: '2025-08-22T09:45:00Z',
    subscriptionEndDate: '2025-09-05T00:00:00Z',
    newCustomer: true,
    repeatCustomer: false,
    averageReview: 4.1,
    features: sampleFeatures.slice(0, 3),
    staff: sampleStaff.slice(0, 2),
    contactEmail: 'service@expresswash.com',
    phoneNumber: '+1-555-0129'
  },
  {
    id: 'client-012',
    name: 'Street Eats Mobile',
    industry: 'Food Truck',
    status: 'Paid',
    monthlyJobs: 203,
    totalRevenue: 168000,
    healthScore: 87,
    joinDate: '2024-02-28T00:00:00Z',
    lastActivity: '2025-08-23T12:15:00Z',
    subscriptionEndDate: '2025-10-28T00:00:00Z',
    newCustomer: false,
    repeatCustomer: true,
    averageReview: 4.6,
    features: sampleFeatures,
    staff: sampleStaff.slice(0, 2),
    contactEmail: 'orders@streeteats.com',
    phoneNumber: '+1-555-0130'
  }
];

// Sample users data
export const sampleUsers: User[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice.johnson@qtick.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2025-08-23T09:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    permissions: ['read', 'write', 'delete', 'admin'],
    avatar: '/avatars/alice.jpg'
  },
  {
    id: 'user-002',
    name: 'Bob Smith',
    email: 'bob.smith@qtick.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-08-23T08:30:00Z',
    createdAt: '2024-02-20T00:00:00Z',
    permissions: ['read', 'write'],
    avatar: '/avatars/bob.jpg'
  },
  {
    id: 'user-003',
    name: 'Carol Davis',
    email: 'carol.davis@qtick.com',
    role: 'Analyst',
    status: 'Active',
    lastLogin: '2025-08-22T16:45:00Z',
    createdAt: '2024-03-10T00:00:00Z',
    permissions: ['read', 'write']
  },
  {
    id: 'user-004',
    name: 'David Wilson',
    email: 'david.wilson@qtick.com',
    role: 'Viewer',
    status: 'Inactive',
    lastLogin: '2025-08-15T14:20:00Z',
    createdAt: '2024-05-05T00:00:00Z',
    permissions: ['read']
  },
  {
    id: 'user-005',
    name: 'Emma Brown',
    email: 'emma.brown@qtick.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-08-23T07:15:00Z',
    createdAt: '2024-06-18T00:00:00Z',
    permissions: ['read', 'write'],
    avatar: '/avatars/emma.jpg'
  }
];

// Industry averages data
export const industryAverages: IndustryAverage[] = [
  {
    industry: 'Technology',
    averageRetention: 85,
    averageReviews: 4.2,
    averageJobGrowth: 15,
    averageHealthScore: 78,
    averageRevenue: 11200
  },
  {
    industry: 'Healthcare',
    averageRetention: 92,
    averageReviews: 4.6,
    averageJobGrowth: 8,
    averageHealthScore: 82,
    averageRevenue: 9800
  },
  {
    industry: 'Finance',
    averageRetention: 88,
    averageReviews: 4.1,
    averageJobGrowth: 12,
    averageHealthScore: 75,
    averageRevenue: 13500
  },
  {
    industry: 'Retail',
    averageRetention: 76,
    averageReviews: 3.9,
    averageJobGrowth: 22,
    averageHealthScore: 68,
    averageRevenue: 8900
  },
  {
    industry: 'Manufacturing',
    averageRetention: 89,
    averageReviews: 4.3,
    averageJobGrowth: 18,
    averageHealthScore: 81,
    averageRevenue: 16700
  },
  {
    industry: 'Construction',
    averageRetention: 72,
    averageReviews: 3.8,
    averageJobGrowth: 25,
    averageHealthScore: 65,
    averageRevenue: 7200
  },
  {
    industry: 'Education',
    averageRetention: 94,
    averageReviews: 4.4,
    averageJobGrowth: 5,
    averageHealthScore: 79,
    averageRevenue: 6500
  },
  {
    industry: 'Energy',
    averageRetention: 86,
    averageReviews: 4.0,
    averageJobGrowth: 14,
    averageHealthScore: 73,
    averageRevenue: 12800
  }
];

// Sample activity feed data
export const sampleActivities: Activity[] = [
  {
    id: 'activity-001',
    type: 'client_signup',
    message: 'New client "TechStart Inc" signed up for trial',
    timestamp: '2025-08-23T10:30:00Z',
    clientId: 'client-new-001',
    clientName: 'TechStart Inc'
  },
  {
    id: 'activity-002',
    type: 'payment_received',
    message: 'Payment received from Manufacturing Corp - $2,480',
    timestamp: '2025-08-23T09:45:00Z',
    clientId: 'client-008',
    clientName: 'Manufacturing Corp',
    metadata: { amount: 2480 }
  },
  {
    id: 'activity-003',
    type: 'feature_used',
    message: 'TechCorp Solutions used AI Recommendations feature',
    timestamp: '2025-08-23T09:15:00Z',
    clientId: 'client-001',
    clientName: 'TechCorp Solutions',
    metadata: { feature: 'AI Recommendations' }
  },
  {
    id: 'activity-004',
    type: 'support_ticket',
    message: 'Support ticket created by Healthcare Plus',
    timestamp: '2025-08-23T08:30:00Z',
    clientId: 'client-003',
    clientName: 'Healthcare Plus'
  },
  {
    id: 'activity-005',
    type: 'renewal',
    message: 'Financial Services Inc renewed subscription',
    timestamp: '2025-08-23T07:20:00Z',
    clientId: 'client-006',
    clientName: 'Financial Services Inc'
  }
];

// Sample reports data
export const sampleReports: Report[] = [
  {
    id: 'report-001',
    name: 'Monthly Revenue Report - July 2025',
    type: 'Revenue',
    createdAt: '2025-08-01T09:00:00Z',
    createdBy: 'Alice Johnson',
    status: 'Generated',
    downloadUrl: '/reports/revenue-july-2025.pdf'
  },
  {
    id: 'report-002',
    name: 'Client Health Analysis - Q2 2025',
    type: 'Client Health',
    createdAt: '2025-07-15T14:30:00Z',
    createdBy: 'Bob Smith',
    status: 'Generated',
    downloadUrl: '/reports/client-health-q2-2025.pdf'
  },
  {
    id: 'report-003',
    name: 'Feature Usage Trends - August 2025',
    type: 'Feature Usage',
    createdAt: '2025-08-20T11:15:00Z',
    createdBy: 'Carol Davis',
    status: 'Processing'
  },
  {
    id: 'report-004',
    name: 'Staff Performance Review - July 2025',
    type: 'Staff Performance',
    createdAt: '2025-08-10T16:45:00Z',
    createdBy: 'Emma Brown',
    status: 'Generated',
    downloadUrl: '/reports/staff-performance-july-2025.pdf'
  }
];

// Sample notifications data
export const sampleNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'New Client Signup',
    message: 'TechStart Inc has signed up for a trial account',
    type: 'success',
    timestamp: '2025-08-23T10:30:00Z',
    read: false,
    actionUrl: '/dashboard?client=client-new-001'
  },
  {
    id: 'notif-002',
    title: 'Payment Received',
    message: 'Manufacturing Corp payment of $2,480 processed successfully',
    type: 'success',
    timestamp: '2025-08-23T09:45:00Z',
    read: false
  },
  {
    id: 'notif-003',
    title: 'Low Health Score Alert',
    message: 'Construction Pro health score dropped to 45%',
    type: 'warning',
    timestamp: '2025-08-23T08:15:00Z',
    read: true,
    actionUrl: '/dashboard?client=client-005'
  },
  {
    id: 'notif-004',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight from 2-4 AM EST',
    type: 'info',
    timestamp: '2025-08-22T16:00:00Z',
    read: true
  }
];

// Sample campaigns data
export const sampleCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: 'Welcome Series - New Trials',
    type: 'Email',
    status: 'Active',
    targetSegment: 'New',
    sentCount: 156,
    openRate: 68,
    clickRate: 24,
    createdAt: '2025-08-01T00:00:00Z'
  },
  {
    id: 'campaign-002',
    name: 'Retention Campaign - At Risk',
    type: 'Email',
    status: 'Active',
    targetSegment: 'At Risk',
    sentCount: 89,
    openRate: 45,
    clickRate: 12,
    createdAt: '2025-08-15T00:00:00Z'
  },
  {
    id: 'campaign-003',
    name: 'Loyalty Rewards Program',
    type: 'Push',
    status: 'Completed',
    targetSegment: 'Loyal',
    sentCount: 234,
    openRate: 82,
    clickRate: 35,
    createdAt: '2025-07-20T00:00:00Z'
  }
];

// Utility functions for data manipulation
export const getClientById = (id: string): Client | undefined => {
  return sampleClients.find(client => client.id === id);
};

export const getClientsByIndustry = (industry: string): Client[] => {
  return sampleClients.filter(client => client.industry === industry);
};

export const getClientsByStatus = (status: string): Client[] => {
  return sampleClients.filter(client => client.status === status);
};

export const getUserById = (id: string): User | undefined => {
  return sampleUsers.find(user => user.id === id);
};

export const getIndustryAverage = (industry: string): IndustryAverage | undefined => {
  return industryAverages.find(avg => avg.industry === industry);
};

// Generate random activity for live feed
export const generateRandomActivity = (): Activity => {
  const types: Activity['type'][] = ['client_signup', 'payment_received', 'feature_used', 'support_ticket', 'renewal'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomClient = sampleClients[Math.floor(Math.random() * sampleClients.length)];
  
  const messages = {
    client_signup: `New client "${randomClient.name}" signed up for trial`,
    payment_received: `Payment received from ${randomClient.name} - $${Math.floor(Math.random() * 5000 + 500)}`,
    feature_used: `${randomClient.name} used ${sampleFeatures[Math.floor(Math.random() * sampleFeatures.length)].featureName} feature`,
    support_ticket: `Support ticket created by ${randomClient.name}`,
    renewal: `${randomClient.name} renewed subscription`
  };

  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: randomType,
    message: messages[randomType],
    timestamp: new Date().toISOString(),
    clientId: randomClient.id,
    clientName: randomClient.name
  };
};