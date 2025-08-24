import { Client, FeatureUsage, StaffStat } from '@/types/domain';

/**
 * Health score calculation utility
 * Calculates a comprehensive health score based on multiple factors
 */

export interface HealthScoreFactors {
  activityScore: number;
  revenueScore: number;
  featureAdoptionScore: number;
  staffPerformanceScore: number;
  retentionScore: number;
}

export interface HealthScoreResult {
  score: number;
  category: 'Good' | 'Warning' | 'Critical';
  factors: HealthScoreFactors;
  recommendations: string[];
}

/**
 * Calculate activity score based on last activity and monthly jobs
 */
export const calculateActivityScore = (client: Client): number => {
  const lastActivity = new Date(client.lastActivity);
  const now = new Date();
  const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  
  // Activity recency score (0-40 points)
  let activityRecencyScore = 0;
  if (daysSinceActivity <= 1) activityRecencyScore = 40;
  else if (daysSinceActivity <= 3) activityRecencyScore = 35;
  else if (daysSinceActivity <= 7) activityRecencyScore = 25;
  else if (daysSinceActivity <= 14) activityRecencyScore = 15;
  else if (daysSinceActivity <= 30) activityRecencyScore = 5;
  else activityRecencyScore = 0;

  // Monthly jobs volume score (0-10 points)
  let jobVolumeScore = 0;
  if (client.monthlyJobs >= 200) jobVolumeScore = 10;
  else if (client.monthlyJobs >= 100) jobVolumeScore = 8;
  else if (client.monthlyJobs >= 50) jobVolumeScore = 6;
  else if (client.monthlyJobs >= 20) jobVolumeScore = 4;
  else if (client.monthlyJobs >= 5) jobVolumeScore = 2;
  else jobVolumeScore = 0;

  return Math.min(50, activityRecencyScore + jobVolumeScore);
};

/**
 * Calculate revenue score based on total revenue and status
 */
export const calculateRevenueScore = (client: Client): number => {
  let baseScore = 0;
  
  // Status-based scoring
  if (client.status === 'Paid') {
    baseScore = 20;
    
    // Revenue tier bonus
    if (client.totalRevenue >= 20000) baseScore += 10;
    else if (client.totalRevenue >= 15000) baseScore += 8;
    else if (client.totalRevenue >= 10000) baseScore += 6;
    else if (client.totalRevenue >= 5000) baseScore += 4;
    else if (client.totalRevenue >= 1000) baseScore += 2;
    
  } else if (client.status === 'Trial') {
    baseScore = 10;
    
    // Trial engagement bonus based on jobs
    if (client.monthlyJobs >= 50) baseScore += 5;
    else if (client.monthlyJobs >= 20) baseScore += 3;
    else if (client.monthlyJobs >= 10) baseScore += 1;
    
  } else if (client.status === 'Free Tier') {
    baseScore = 5;
    
    // Free tier engagement bonus
    if (client.monthlyJobs >= 20) baseScore += 3;
    else if (client.monthlyJobs >= 10) baseScore += 2;
    else if (client.monthlyJobs >= 5) baseScore += 1;
  }

  return Math.min(30, baseScore);
};

/**
 * Calculate feature adoption score based on feature usage
 */
export const calculateFeatureAdoptionScore = (features: FeatureUsage[]): number => {
  if (features.length === 0) return 0;

  const totalFeatures = 5; // Assuming 5 main features available
  const adoptedFeatures = features.length;
  
  // Base adoption score
  const adoptionRatio = adoptedFeatures / totalFeatures;
  const baseScore = adoptionRatio * 10;

  // Usage intensity bonus
  const avgUsageCount = features.reduce((sum, f) => sum + f.usageCount, 0) / features.length;
  let usageBonus = 0;
  if (avgUsageCount >= 200) usageBonus = 5;
  else if (avgUsageCount >= 100) usageBonus = 4;
  else if (avgUsageCount >= 50) usageBonus = 3;
  else if (avgUsageCount >= 20) usageBonus = 2;
  else if (avgUsageCount >= 5) usageBonus = 1;

  // Premium feature usage bonus
  const premiumFeatures = features.filter(f => f.category === 'Premium');
  const premiumBonus = premiumFeatures.length * 2;

  return Math.min(20, baseScore + usageBonus + premiumBonus);
};

/**
 * Calculate staff performance score
 */
export const calculateStaffPerformanceScore = (staff: StaffStat[]): number => {
  if (staff.length === 0) return 0;

  const avgEfficiency = staff.reduce((sum, s) => sum + s.efficiency, 0) / staff.length;
  const avgRating = staff.reduce((sum, s) => sum + s.customerRating, 0) / staff.length;
  
  // Efficiency score (0-10 points)
  let efficiencyScore = 0;
  if (avgEfficiency >= 95) efficiencyScore = 10;
  else if (avgEfficiency >= 90) efficiencyScore = 8;
  else if (avgEfficiency >= 85) efficiencyScore = 6;
  else if (avgEfficiency >= 80) efficiencyScore = 4;
  else if (avgEfficiency >= 75) efficiencyScore = 2;

  // Rating score (0-10 points)
  let ratingScore = 0;
  if (avgRating >= 4.8) ratingScore = 10;
  else if (avgRating >= 4.5) ratingScore = 8;
  else if (avgRating >= 4.0) ratingScore = 6;
  else if (avgRating >= 3.5) ratingScore = 4;
  else if (avgRating >= 3.0) ratingScore = 2;

  return Math.min(20, efficiencyScore + ratingScore);
};

/**
 * Calculate retention score based on join date and activity
 */
export const calculateRetentionScore = (client: Client): number => {
  const joinDate = new Date(client.joinDate);
  const now = new Date();
  const monthsSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  // Longevity bonus
  let longevityScore = 0;
  if (monthsSinceJoin >= 12) longevityScore = 10;
  else if (monthsSinceJoin >= 6) longevityScore = 8;
  else if (monthsSinceJoin >= 3) longevityScore = 6;
  else if (monthsSinceJoin >= 1) longevityScore = 4;
  else longevityScore = 2;

  return longevityScore;
};

/**
 * Generate recommendations based on health score factors
 */
export const generateRecommendations = (client: Client, factors: HealthScoreFactors): string[] => {
  const recommendations: string[] = [];

  if (factors.activityScore < 20) {
    recommendations.push('Client has low recent activity. Consider reaching out to re-engage.');
  }

  if (factors.revenueScore < 15 && client.status === 'Trial') {
    recommendations.push('Trial client with low engagement. Schedule conversion call.');
  }

  if (factors.featureAdoptionScore < 10) {
    recommendations.push('Low feature adoption. Provide onboarding or training sessions.');
  }

  if (factors.staffPerformanceScore < 10 && client.staff.length > 0) {
    recommendations.push('Staff performance below average. Consider additional training.');
  }

  if (factors.retentionScore < 5) {
    recommendations.push('New client. Ensure proper onboarding and regular check-ins.');
  }

  if (client.status === 'Free Tier' && factors.activityScore > 30) {
    recommendations.push('High-activity free tier user. Good candidate for upgrade.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Client is performing well. Continue current engagement strategy.');
  }

  return recommendations;
};

/**
 * Calculate comprehensive health score for a client
 */
export const calculateHealthScore = (client: Client): HealthScoreResult => {
  const factors: HealthScoreFactors = {
    activityScore: calculateActivityScore(client),
    revenueScore: calculateRevenueScore(client),
    featureAdoptionScore: calculateFeatureAdoptionScore(client.features),
    staffPerformanceScore: calculateStaffPerformanceScore(client.staff),
    retentionScore: calculateRetentionScore(client)
  };

  const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0);

  let category: 'Good' | 'Warning' | 'Critical';
  if (totalScore >= 80) category = 'Good';
  else if (totalScore >= 60) category = 'Warning';
  else category = 'Critical';

  const recommendations = generateRecommendations(client, factors);

  return {
    score: Math.round(totalScore),
    category,
    factors,
    recommendations
  };
};

/**
 * Get health score color class for UI components
 */
export const getHealthScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600 bg-green-100';
  if (score >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

/**
 * Get health score category color for badges
 */
export const getHealthCategoryColor = (category: 'Good' | 'Warning' | 'Critical'): string => {
  switch (category) {
    case 'Good':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Warning':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Critical':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Convert health score number to Badge-compatible format
 */
export const getHealthBadgeProps = (healthScore: number): { score: 'Green' | 'Yellow' | 'Red', label: string } => {
  if (healthScore >= 80) {
    return { score: 'Green', label: 'Healthy' };
  } else if (healthScore >= 60) {
    return { score: 'Yellow', label: 'At Risk' };
  } else {
    return { score: 'Red', label: 'Critical' };
  }
};

/**
 * Simple health score calculation for Badge compatibility
 */
export const calculateSimpleHealthScore = (client: Client): { score: 'Green' | 'Yellow' | 'Red', label: string } => {
  return getHealthBadgeProps(client.healthScore);
};

/**
 * Batch calculate health scores for multiple clients
 */
export const calculateBatchHealthScores = (clients: Client[]): Map<string, HealthScoreResult> => {
  const results = new Map<string, HealthScoreResult>();
  
  clients.forEach(client => {
    results.set(client.id, calculateHealthScore(client));
  });

  return results;
};

/**
 * Get clients by health category
 */
export const getClientsByHealthCategory = (
  clients: Client[], 
  category: 'Good' | 'Warning' | 'Critical'
): Client[] => {
  return clients.filter(client => {
    const healthResult = calculateHealthScore(client);
    return healthResult.category === category;
  });
};