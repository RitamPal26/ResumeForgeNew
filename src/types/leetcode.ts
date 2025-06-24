export interface LeetCodeProfile {
  username: string;
  realName: string;
  aboutMe: string;
  avatar: string;
  location: string;
  websites: string[];
  skillTags: string[];
  company: string;
  school: string;
  ranking: number;
  submitStats: SubmitStats;
  badges: Badge[];
}

export interface SubmitStats {
  acSubmissionNum: DifficultyStats[];
  totalSubmissionNum: DifficultyStats[];
}

export interface DifficultyStats {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
  submissions: number;
}

export interface Badge {
  id: string;
  displayName: string;
  icon: string;
  creationDate: string;
}

export interface ContestData {
  ranking: ContestRanking;
  history: ContestHistory[];
}

export interface ContestRanking {
  attendedContestsCount: number;
  rating: number;
  globalRanking: number;
  totalParticipants: number;
  topPercentage: number;
  badge?: {
    name: string;
  };
}

export interface ContestHistory {
  attended: boolean;
  trendDirection: string;
  problemsSolved: number;
  totalProblems: number;
  finishTimeInSeconds: number;
  rating: number;
  ranking: number;
  contest: {
    title: string;
    startTime: string;
  };
}

export interface Submission {
  title: string;
  titleSlug: string;
  timestamp: string;
  status: string;
  language: string;
  runtime: string;
  memory: string;
  url: string;
  isPending: boolean;
  hasNotes: boolean;
  notes: string;
}

export interface ProblemStats {
  totalQuestions: DifficultyStats[];
  solvedStats: DifficultyStats[];
  beatsStats: BeatsStats[];
  tagStats: TagStats;
}

export interface BeatsStats {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  percentage: number;
}

export interface TagStats {
  advanced: TagCount[];
  intermediate: TagCount[];
  fundamental: TagCount[];
}

export interface TagCount {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

export interface LanguageStats {
  language: string;
  count: number;
  percentage: number;
  color: string;
}

export interface UnifiedScore {
  overall: number;
  github: GitHubScore;
  leetcode: LeetCodeScore;
  breakdown: ScoreBreakdown;
  recommendations: Recommendation[];
  interviewReadiness: InterviewReadiness;
}

export interface GitHubScore {
  overall: number;
  repository: number;
  language: number;
  collaboration: number;
  complexity: number;
  activity: number;
  details: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    primaryLanguages: string[];
  };
}

export interface LeetCodeScore {
  overall: number;
  problemSolving: number;
  contest: number;
  consistency: number;
  difficulty: number;
  details: {
    totalSolved: number;
    contestRating: number;
    contestsAttended: number;
    globalRanking: number;
    algorithmCoverage: AlgorithmCoverage;
  };
}

export interface AlgorithmCoverage {
  total: number;
  core: number;
  percentage: number;
}

export interface ScoreBreakdown {
  strengths: string[];
  weaknesses: string[];
  balanceScore: number;
  skillDistribution: {
    implementation: number;
    problemSolving: number;
    collaboration: number;
    algorithms: number;
  };
}

export interface Recommendation {
  category: 'GitHub' | 'LeetCode' | 'General';
  priority: 'High' | 'Medium' | 'Low';
  action: string;
  description: string;
}

export interface InterviewReadiness {
  overall: number;
  algorithm: number;
  systemDesign: number;
  coding: number;
  behavioral: number;
  readinessLevel: string;
  recommendations: string[];
}

export interface DeveloperProfile {
  github: {
    username: string;
    profile: any; // GitHubProfile from existing types
    score: GitHubScore;
  };
  leetcode: {
    username: string;
    profile: LeetCodeProfile;
    score: LeetCodeScore;
  };
  unified: UnifiedScore;
  lastAnalyzed: string;
  cacheExpiry: string;
}