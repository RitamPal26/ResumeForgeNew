export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  bio?: string;
  profilePhoto?: string;
  githubConnected: boolean;
  leetcodeConnected: boolean;
  lastSync?: string;
  syncFrequency: 'daily' | 'weekly' | 'manual';
  emailNotifications: {
    analysisCompletion: boolean;
    securityAlerts: boolean;
    productUpdates: boolean;
  };
  dataRetention: 30 | 60 | 90;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateData {
  displayName?: string;
  phone?: string;
  bio?: string;
  profilePhoto?: string;
  syncFrequency?: 'daily' | 'weekly' | 'manual';
  emailNotifications?: {
    analysisCompletion?: boolean;
    securityAlerts?: boolean;
    productUpdates?: boolean;
  };
  dataRetention?: 30 | 60 | 90;
  language?: string;
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ExternalAccount {
  provider: 'github' | 'leetcode';
  connected: boolean;
  username?: string;
  lastSync?: string;
  syncEnabled: boolean;
}

export interface AnalyticsData {
  monthlyAnalysisCount: number;
  successRate: number;
  averageAnalysisTime: number;
  totalReports: number;
  lastAnalysis?: string;
}

export interface NotificationPreferences {
  analysisCompletion: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}

export interface DataExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  includeAnalytics: boolean;
  includeReports: boolean;
}