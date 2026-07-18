/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  FARMER = 'farmer',
  BUYER = 'buyer',
  EXPERT = 'expert',
  ADMIN = 'admin',
}

export interface Field {
  id: string;
  name: string;
  area: number;
  crop: string;
  soilHealth: number;
  lastTested: string;
}

export interface Expense {
  id: string;
  userId: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Fuel' | 'Labour' | 'Machinery' | 'Transport' | 'Electricity' | 'Water' | 'Miscellaneous';
  amount: number;
  date: string;
  description: string;
  billImage?: string;
  createdAt: string;
}

export interface Income {
  id: string;
  userId: string;
  source: 'Crop Sales' | 'Equipment Rental' | 'Dairy' | 'Subsidy' | 'Other';
  amount: number;
  date: string;
  description: string;
  createdAt: string;
}

export interface GovScheme {
  id: string;
  title: string;
  department: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  lastDate?: string;
  status: 'Active' | 'Closed';
  applyUrl: string;
  bannerUrl?: string;
  helpline?: string;
  faq?: { question: string; answer: string }[];
}

export interface EligibilityResult {
  id: string;
  userId: string;
  farmerName: string;
  state: string;
  district: string;
  age: number;
  gender: string;
  landOwnership: string;
  farmSize: number;
  annualIncome: number;
  cropType: string;
  category: string;
  existingBenefits: string[];
  eligibleSchemes: string[];
  notEligibleSchemes: string[];
  eligibilityPercentage: number;
  missingRequirements: string[];
  suggestedSchemes: string[];
  createdAt: string;
}

export interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  coverageDetails: string;
  premiumRate: number;
  benefits: string[];
}

export interface InsuranceClaim {
  id: string;
  userId: string;
  policyNumber: string;
  cropName: string;
  damageReason: string;
  damagePercentage: number;
  incidentDate: string;
  farmLocation: string;
  images: string[];
  documents: string[];
  notes?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  type: 'Agriculture' | 'Crop' | 'Equipment' | 'Kisan Credit Card' | 'Other';
  amount: number;
  interestRate: number;
  durationMonths: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  schemeId: string;
  schemeTitle: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  appliedDate: string;
  lastUpdated: string;
  formData: any;
  documents: { type: string; url: string }[];
}

export interface UserDocument {
  id: string;
  userId: string;
  type: string; // Aadhaar, PAN, etc.
  name: string;
  url: string;
  uploadedAt: string;
}

export interface GovNews {
  id: string;
  title: string;
  content: string;
  category: 'Scheme' | 'Policy' | 'Announcement' | 'Deadline';
  date: string;
  url?: string;
}

export interface SavedScheme {
  id: string;
  userId: string;
  schemeId: string;
  savedAt: string;
}

export interface ForumPost {
  id: string;
  author: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  password?: string; // Only handled on server but included in DB
  role: UserRole;
  avatar?: string;
  address?: string;
  state?: string;
  district?: string;
  bio?: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: string;
  fields: Field[];
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  quantity: number;
  location: {
    state: string;
    district: string;
    village: string;
  };
  images: string[];
  isOrganic: boolean;
  harvestDate: string;
  expiryDate: string;
  status: 'Published' | 'Draft' | 'Hidden' | 'OutOfStock';
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  farmerId: string;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Completed';
  deliveryAddress: string;
  contactNumber: string;
  message?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  reply?: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Farm Tools' | 'Spare Parts' | 'Fuel Stock';
  currentStock: number;
  unit: string;
  lowStockThreshold: number;
  lastUpdated: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Product' | 'Order' | 'Review' | 'System' | 'Alert' | 'Inquiry';
  isRead: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  productId: string;
  farmerId: string;
  buyerId: string;
  buyerName: string;
  message: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
}

export interface CropAlternative {
  name: string;
  profit: number;
  yield: string;
  waterRequirement: string;
  duration: string;
  imageUrl: string;
}

export interface CropRecommendation {
  id: string;
  userId: string;
  farmerName: string;
  farmName: string;
  state: string;
  district: string;
  village: string;
  farmArea: number;
  soilType: string;
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  season: string;
  avgTemperature: number;
  rainfall: number;
  humidity: number;
  irrigationAvailable: boolean;
  preferredCropType: string;
  budget: number;
  waterAvailability: string;
  organicFarming: boolean;
  previousCrop: string;
  farmingExperience: string;
  
  // AI Generated Fields
  recommendedCrop: string;
  confidenceScore: number;
  reason: string;
  expectedYield: string;
  estimatedProfit: number;
  cropDuration: string;
  waterRequirement: string;
  fertilizerSuggestion: string;
  pestRiskLevel: string;
  suitableSeason: string;
  estimatedHarvestDate: string;
  marketDemand: string;
  difficultyLevel: string;
  sustainabilityScore: number;
  alternatives: CropAlternative[];
  
  // Detailed Guides (Optional for history view, populated for detail view)
  completeCropGuide?: string;
  soilRequirement?: string;
  fertilizerSchedule?: string;
  irrigationSchedule?: string;
  pestManagement?: string;
  harvestProcess?: string;
  marketPriceTrend?: string;
  storageSuggestions?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  village: string;
  district: string;
  state: string;
  size: number;
  crop: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SoilReport {
  id: string;
  userId: string;
  farmId: string;
  soilType: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
  electricalConductivity: number;
  healthScore: number;
  analysisDate: string;
  recommendations: string[];
  tips: string[];
  createdAt: string;
}

export interface IrrigationSchedule {
  id: string;
  userId: string;
  farmId: string;
  dailyRequirement: string;
  weeklySchedule: { day: string; amount: string; advice: string }[];
  type: 'Drip' | 'Flood' | 'Sprinkler';
  tips: string[];
  createdAt: string;
}

export interface WeatherAlert {
  id: string;
  type: 'Rain' | 'Storm' | 'Heatwave' | 'Coldwave' | 'Wind';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  message: string;
  timestamp: string;
}

export interface DiseaseTreatment {
  organic: string;
  chemical: string;
  homeRemedies: string;
  recommendedPesticides: string[];
  sprayInstructions: string;
  safetyInstructions: string;
}

export interface DiseaseReport {
  id: string;
  userId: string;
  cropName: string;
  diseaseName: string;
  confidenceScore: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Healthy' | 'Unhealthy';
  analysis: string;
  description: string;
  symptoms: string[];
  causes: string[];
  affectedParts: string[];
  spreadRisk: string;
  suitableClimate: string;
  earlyWarningSigns: string[];
  treatment: DiseaseTreatment;
  prevention: {
    waterManagement: string;
    fertilizerTips: string;
    soilHealthTips: string;
    cropRotation: string;
    weedControl: string;
    generalTips: string[];
  };
  recoveryTips: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  sender: 'user' | 'ai';
  language: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userAvatar?: string;
  title: string;
  content: string;
  cropType?: string;
  category: string;
  images?: string[];
  videos?: string[];
  location?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  isSaved: boolean;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  replies: Comment[];
  parentId?: string;
  createdAt: string;
}

export interface Expert {
  id: string;
  userId: string;
  name: string;
  qualification: string;
  experience: number;
  specialization: string;
  rating: number;
  languages: string[];
  avatar: string;
  bio: string;
  certifications: string[];
  articles: string[];
  videos: string[];
  availability: string;
  reviewsCount: number;
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  progress: number;
  modules: { title: string; duration: string }[];
  notesUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  category: string;
  duration: string;
  views: number;
  isFavorite: boolean;
  isWatchLater: boolean;
  createdAt: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  category: string;
  author: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export interface SuccessStory {
  id: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  images: string[];
  videos?: string[];
  journey: string;
  results: string;
  incomeGrowth: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  banner: string;
  date: string;
  time: string;
  speaker: string;
  location: string;
  description: string;
  isRegistered: boolean;
  maxParticipants: number;
  registeredCount: number;
  createdAt: string;
}

export interface Machinery {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'Equipment' | 'Vehicle';
  category: string;
  images: string[];
  specifications: { key: string; value: string }[];
  workingCapacity: string;
  fuelConsumption: string;
  fuelType: 'Diesel' | 'Petrol' | 'Electric' | 'CNG';
  capacity?: string;
  dailyPrice: number;
  hourlyPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  availability: boolean;
  availabilityCalendar?: { date: string; isAvailable: boolean }[];
  rating: number;
  reviewsCount: number;
  distance: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RentalBooking {
  id: string;
  machineryId: string;
  machineryName: string;
  machineryImage: string;
  farmerId: string;
  farmerName: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  duration: number;
  unit: 'hour' | 'day' | 'week' | 'month';
  quantity: number;
  deliveryRequired: boolean;
  deliveryAddress: string;
  notes?: string;
  rentalCharges: number;
  deliveryCharges: number;
  gst: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Cancelled';
  invoiceUrl?: string;
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  rain: number;
  wind: number;
  description: string;
  icon: string;
}

export interface AdminUser extends User {
  role: UserRole.ADMIN;
  permissions: string[];
  lastLogin?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

export interface Permission {
  id: string;
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'export' | 'approve' | 'reject')[];
}

export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  status: 'Published' | 'Draft' | 'Archived';
  lastUpdated: string;
}

export interface WebsiteSettings {
  id: string;
  siteName: string;
  logo: string;
  favicon: string;
  theme: 'Light' | 'Dark' | 'System';
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: { platform: string; url: string }[];
  seoTitle: string;
  seoDescription: string;
  googleMapsKey?: string;
  cloudinaryCloudName?: string;
  isMaintenanceMode: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
  userId: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  assignedExpertId?: string;
  category: string;
  messages: { senderId: string; senderName: string; text: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFeedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  category: 'Bug Report' | 'Feature Request' | 'General Feedback' | 'Suggestion';
  message: string;
  status: 'New' | 'Under Review' | 'Replied' | 'Resolved';
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface SystemHealth {
  serverStatus: 'Online' | 'Offline' | 'Degraded';
  databaseStatus: 'Online' | 'Offline';
  storageUsage: number;
  memoryUsage: number;
  cpuUsage: number;
  apiResponseTime: number;
  lastChecked: string;
}

export interface BackupInfo {
  id: string;
  fileName: string;
  size: number;
  status: 'Completed' | 'Failed';
  createdAt: string;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Emergency' | 'Maintenance';
  target: 'All' | 'Farmers' | 'Buyers' | 'Experts';
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Weather' | 'Disease' | 'Irrigation' | 'Fertilizer' | 'Harvest' | 'Market' | 'Rental' | 'Gov' | 'Community' | 'AI' | 'Admin';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  category: 'Irrigation' | 'Fertilizer' | 'Harvest' | 'Sowing' | 'Market' | 'Rental' | 'Insurance' | 'Gov' | 'Other';
  status: 'Pending' | 'Completed';
  createdAt: string;
}

export interface AiChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'Text' | 'Voice';
  language: 'English' | 'Hindi';
  category?: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  userId: string;
  recipientEmail: string;
  subject: string;
  body: string;
  type: 'Auth' | 'Order' | 'Rental' | 'Gov' | 'Alert' | 'Reminder' | 'Community' | 'Admin';
  status: 'Sent' | 'Failed';
  sentAt: string;
}

export interface AiSuggestion {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  category: 'Weather' | 'Soil' | 'Crop' | 'Market' | 'Irrigation' | 'General';
  actionLabel?: string;
  actionLink?: string;
  createdAt: string;
}
