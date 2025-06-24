export interface AnalysisEntry {
  id: string;
  date: string;
  overallScore: number;
  githubScore: number;
  leetcodeScore: number;
  status: 'complete' | 'in-progress' | 'failed';
  skillScores: { [key: string]: number };
  achievements: string[];
  usernames?: {
    github: string;
    leetcode: string;
  };
  duration?: number; // Analysis duration in seconds
  reportUrl?: string;
}

export interface HistoryMetrics {
  totalAnalyses: number;
  averageScore: number;
  scoreChange: number; // Percentage change from previous period
  latestAnalysisDate: string | null;
  currentStreak: number;
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  } | null;
  status: 'all' | 'complete' | 'in-progress' | 'failed';
  minScore: number;
  maxScore: number;
  searchQuery: string;
}

export interface SortOptions {
  field: 'date' | 'overallScore' | 'githubScore' | 'leetcodeScore' | 'status';
  direction: 'asc' | 'desc';
}

export interface ChartDataPoint {
  date: string;
  overallScore: number;
  githubScore: number;
  leetcodeScore: number;
}

export interface SkillComparisonData {
  skillName: string;
  currentScore: number;
  previousScore: number;
  change: number;
}