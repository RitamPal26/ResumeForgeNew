export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  open_issues_count: number;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_downloads: boolean;
  license: {
    key: string;
    name: string;
  } | null;
}

export interface GitHubProfile {
  id: number;
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
  updated_at: string;
}

export interface LanguageStats {
  language: string;
  percentage: number;
  bytes: number;
  color: string;
  proficiency: number; // 0-100 based on usage and complexity
}

export interface RepositoryCategory {
  category: string;
  count: number;
  percentage: number;
  repositories: string[];
  color: string;
}

export interface ActivityPattern {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
  repositories: string[];
}

export interface CollaborationMetrics {
  engagementScore: number; // 0-100
  averageStarsPerRepo: number;
  averageForksPerRepo: number;
  totalContributors: number;
  issueResponseTime: number; // in hours
  communityHealth: number; // 0-100
}

export interface ProjectComplexity {
  complexityScore: number; // 0-100
  averageRepoSize: number;
  multiLanguageProjects: number;
  documentationQuality: number; // 0-100
  dependencyComplexity: number; // 0-100
}

export interface DeveloperClassification {
  primaryRole: string;
  confidence: number; // 0-100
  skills: string[];
  experience: 'Junior' | 'Mid' | 'Senior' | 'Expert';
  specializations: string[];
}

export interface DeveloperAnalysis {
  username: string;
  profile: GitHubProfile;
  languageStats: LanguageStats[];
  repositoryCategories: RepositoryCategory[];
  activityPatterns: ActivityPattern[];
  collaborationMetrics: CollaborationMetrics;
  projectComplexity: ProjectComplexity;
  developerClassification: DeveloperClassification;
  impactMetrics: {
    totalStars: number;
    totalForks: number;
    projectReach: number;
    communityImpact: number;
    codeQuality: number;
  };
  lastAnalyzed: string;
  cacheExpiry: string;
}

export interface AnalysisProgress {
  stage: 'basic' | 'detailed' | 'advanced' | 'complete';
  progress: number; // 0-100
  currentTask: string;
  estimatedTimeRemaining: number; // in seconds
}