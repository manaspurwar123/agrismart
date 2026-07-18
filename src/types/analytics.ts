export interface DashboardStats {
  totalFarms: number;
  totalCrops: number;
  expectedYield: number;
  currentYield: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  waterConsumption: number;
  activeFarmers: number;
  activeBuyers: number;
  activeEquipment: number;
  totalOrders: number;
  marketplaceRevenue: number;
  equipmentRentalRevenue: number;
  benefitsReceived: number;
  aiPredictionsGenerated: number;
}

export interface FarmAnalytics {
  performanceScore: number;
  cropGrowthIndex: number;
  soilHealthScore: number;
  irrigationEfficiency: number;
  productivityScore: number;
  landUtilization: number;
  harvestSuccessRate: number;
  monthlyProduction: { month: string; value: number }[];
  cropDistribution: { name: string; value: number }[];
}

export interface PredictionResult {
  id: string;
  expectedYield?: number;
  confidenceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  suggestions: string[];
  harvestEstimate?: string;
  expectedRevenue?: string;
  estimatedProfit?: string;
  breakEvenPoint?: string;
  roi?: string;
  profitMargin?: string;
}

export interface AIInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'success' | 'warning' | 'error' | 'info';
}

export interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  url: string;
}
