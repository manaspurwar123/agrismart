import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server-db.json');

interface Database {
  users: any[];
  products: any[];
  orders: any[];
  diseaseReports: any[];
  cropRecommendations: any[];
  forumPosts: any[];
  farms: any[];
  soilReports: any[];
  wishlist: any[];
  reviews: any[];
  inventory: any[];
  notifications: any[];
  inquiries: any[];
  govSchemes: any[];
  eligibilityResults: any[];
  insuranceClaims: any[];
  loans: any[];
  applications: any[];
  userDocuments: any[];
  govNews: any[];
  savedSchemes: any[];
  communityPosts: any[];
  questions: any[];
  comments: any[];
  experts: any[];
  courses: any[];
  videos: any[];
  blogs: any[];
  events: any[];
  chatHistory: any[];
  eventRegistrations: any[];
  savedPosts: any[];
  machinery: any[];
  bookings: any[];
  expenses: any[];
  income: any[];
  admins: any[];
  roles: any[];
  permissions: any[];
  cms: any[];
  websiteSettings: any[];
  mediaLibrary: any[];
  reports: any[];
  analytics: any[];
  emails: any[];
  emailHistory: any[];
  supportTickets: any[];
  feedback: any[];
  activityLogs: any[];
  systemLogs: any[];
  backups: any[];
  announcements: any[];
  aiChats: any[];
  voiceCommands: any[];
  alerts: any[];
  reminders: any[];
  aiSuggestions: any[];
  yieldPredictions: any[];
  profitPredictions: any[];
  farmReports: any[];
  financialReports: any[];
  weatherReports: any[];
  diseaseAnalytics: any[];
  marketAnalytics: any[];
  dashboardLayouts: any[];
  savedReports: any[];
  scheduledReports: any[];
  aiInsights: any[];
  farmLocations: any[];
  qrCodes: any[];
  barcodes: any[];
  iotSensors: any[];
  sensorHistory: any[];
  drones: any[];
  droneMissions: any[];
  irrigationLogs: any[];
  offlineData: any[];
  warehouses: any[];
  routes: any[];
  emergencyContacts: any[];
}

const DEFAULT_DB: Database = {
  users: [],
  products: [],
  orders: [],
  diseaseReports: [],
  cropRecommendations: [],
  forumPosts: [],
  farms: [],
  soilReports: [],
  wishlist: [],
  reviews: [],
  inventory: [],
  notifications: [],
  inquiries: [],
  govSchemes: [],
  eligibilityResults: [],
  insuranceClaims: [],
  loans: [],
  applications: [],
  userDocuments: [],
  govNews: [],
  savedSchemes: [],
  communityPosts: [],
  questions: [],
  comments: [],
  experts: [],
  courses: [],
  videos: [],
  blogs: [],
  events: [],
  chatHistory: [],
  eventRegistrations: [],
  savedPosts: [],
  machinery: [],
  bookings: [],
  expenses: [],
  income: [],
  admins: [],
  roles: [],
  permissions: [],
  cms: [],
  websiteSettings: [],
  mediaLibrary: [],
  reports: [],
  analytics: [],
  emails: [],
  emailHistory: [],
  supportTickets: [],
  feedback: [],
  activityLogs: [],
  systemLogs: [],
  backups: [],
  announcements: [],
  aiChats: [],
  voiceCommands: [],
  alerts: [],
  reminders: [],
  aiSuggestions: [],
  yieldPredictions: [],
  profitPredictions: [],
  farmReports: [],
  financialReports: [],
  weatherReports: [],
  diseaseAnalytics: [],
  marketAnalytics: [],
  dashboardLayouts: [],
  savedReports: [],
  scheduledReports: [],
  aiInsights: [],
  farmLocations: [],
  qrCodes: [],
  barcodes: [],
  iotSensors: [],
  sensorHistory: [],
  drones: [],
  droneMissions: [],
  irrigationLogs: [],
  offlineData: [],
  warehouses: [],
  routes: [],
  emergencyContacts: [],
};

export function readDb(): Database {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function updateCollection(collection: keyof Database, item: any): void {
  const db = readDb();
  const index = db[collection].findIndex((i: any) => i.id === item.id);
  if (index !== -1) {
    db[collection][index] = item;
  } else {
    db[collection].push(item);
  }
  writeDb(db);
}
