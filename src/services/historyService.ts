import { supabase } from './supabase';
import type { AnalysisEntry, HistoryMetrics, FilterOptions, SortOptions } from '../types/history';

class HistoryService {
  // Generate mock data for testing
  generateMockData(): AnalysisEntry[] {
    const mockEntries: AnalysisEntry[] = [];
    const statuses: Array<'complete' | 'in-progress' | 'failed'> = ['complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'complete', 'in-progress', 'failed'];
    const achievements = [
      'First Analysis Complete',
      'GitHub Expert',
      'LeetCode Warrior',
      'Balanced Developer',
      'Problem Solver',
      'Code Quality Master',
      'Collaboration Champion',
      'Algorithm Ace',
      'Language Polyglot',
      'Consistency King'
    ];

    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7 + Math.random() * 7)); // Spread over weeks
      
      const overallScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const githubScore = Math.floor(Math.random() * 30) + 50; // 50-80
      const leetcodeScore = Math.floor(Math.random() * 35) + 45; // 45-80
      
      mockEntries.push({
        id: `analysis-${i + 1}`,
        date: date.toISOString(),
        overallScore,
        githubScore,
        leetcodeScore,
        status: statuses[i] || 'complete',
        skillScores: {
          'Algorithm Design': Math.floor(Math.random() * 30) + 60,
          'Code Quality': Math.floor(Math.random() * 25) + 65,
          'Problem Solving': Math.floor(Math.random() * 35) + 55,
          'Collaboration': Math.floor(Math.random() * 40) + 50,
          'System Design': Math.floor(Math.random() * 30) + 55,
          'Data Structures': Math.floor(Math.random() * 25) + 70,
        },
        achievements: achievements.slice(0, Math.floor(Math.random() * 3) + 1),
        usernames: {
          github: `user${i + 1}`,
          leetcode: `coder${i + 1}`
        },
        duration: Math.floor(Math.random() * 45) + 30, // 30-75 seconds
        reportUrl: `/reports/analysis-${i + 1}.pdf`
      });
    }

    return mockEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAnalysisHistory(userId: string): Promise<AnalysisEntry[]> {
    try {
      // For now, return mock data
      // In production, this would fetch from Supabase
      return this.generateMockData();
      
      // Production implementation would be:
      // const { data, error } = await supabase
      //   .from('analysis_history')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;
      // return data || [];
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
      throw new Error('Failed to load analysis history');
    }
  }

  async getHistoryMetrics(userId: string): Promise<HistoryMetrics> {
    try {
      const history = await this.getAnalysisHistory(userId);
      const completeAnalyses = history.filter(entry => entry.status === 'complete');
      
      if (completeAnalyses.length === 0) {
        return {
          totalAnalyses: 0,
          averageScore: 0,
          scoreChange: 0,
          latestAnalysisDate: null,
          currentStreak: 0
        };
      }

      const totalAnalyses = completeAnalyses.length;
      const averageScore = Math.round(
        completeAnalyses.reduce((sum, entry) => sum + entry.overallScore, 0) / totalAnalyses
      );

      // Calculate score change (last 5 vs previous 5)
      const recent = completeAnalyses.slice(0, 5);
      const previous = completeAnalyses.slice(5, 10);
      
      let scoreChange = 0;
      if (previous.length > 0) {
        const recentAvg = recent.reduce((sum, entry) => sum + entry.overallScore, 0) / recent.length;
        const previousAvg = previous.reduce((sum, entry) => sum + entry.overallScore, 0) / previous.length;
        scoreChange = Math.round(((recentAvg - previousAvg) / previousAvg) * 100);
      }

      const latestAnalysisDate = completeAnalyses[0]?.date || null;
      
      // Calculate current streak (consecutive weeks with analysis)
      let currentStreak = 0;
      const now = new Date();
      for (let i = 0; i < completeAnalyses.length; i++) {
        const analysisDate = new Date(completeAnalyses[i].date);
        const weeksDiff = Math.floor((now.getTime() - analysisDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        if (weeksDiff === i) {
          currentStreak++;
        } else {
          break;
        }
      }

      return {
        totalAnalyses,
        averageScore,
        scoreChange,
        latestAnalysisDate,
        currentStreak
      };
    } catch (error) {
      console.error('Failed to calculate history metrics:', error);
      throw new Error('Failed to calculate metrics');
    }
  }

  filterAndSortHistory(
    history: AnalysisEntry[],
    filters: FilterOptions,
    sort: SortOptions
  ): AnalysisEntry[] {
    let filtered = [...history];

    // Apply filters
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filtered = filtered.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      });
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(entry => entry.status === filters.status);
    }

    filtered = filtered.filter(entry => 
      entry.overallScore >= filters.minScore && 
      entry.overallScore <= filters.maxScore
    );

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.usernames?.github.toLowerCase().includes(query) ||
        entry.usernames?.leetcode.toLowerCase().includes(query) ||
        entry.achievements.some(achievement => achievement.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'overallScore':
          aValue = a.overallScore;
          bValue = b.overallScore;
          break;
        case 'githubScore':
          aValue = a.githubScore;
          bValue = b.githubScore;
          break;
        case 'leetcodeScore':
          aValue = a.leetcodeScore;
          bValue = b.leetcodeScore;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }

  async deleteAnalysis(userId: string, analysisId: string): Promise<void> {
    try {
      // In production, this would delete from Supabase
      console.log(`Deleting analysis ${analysisId} for user ${userId}`);
      
      // const { error } = await supabase
      //   .from('analysis_history')
      //   .delete()
      //   .eq('id', analysisId)
      //   .eq('user_id', userId);
      
      // if (error) throw error;
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      throw new Error('Failed to delete analysis');
    }
  }

  async retryAnalysis(userId: string, analysisId: string): Promise<void> {
    try {
      // In production, this would trigger a new analysis
      console.log(`Retrying analysis ${analysisId} for user ${userId}`);
      
      // const { error } = await supabase
      //   .from('analysis_history')
      //   .update({ status: 'in-progress' })
      //   .eq('id', analysisId)
      //   .eq('user_id', userId);
      
      // if (error) throw error;
    } catch (error) {
      console.error('Failed to retry analysis:', error);
      throw new Error('Failed to retry analysis');
    }
  }

  async exportData(userId: string, format: 'csv' | 'json'): Promise<Blob> {
    try {
      const history = await this.getAnalysisHistory(userId);
      
      if (format === 'csv') {
        const csvContent = this.convertToCSV(history);
        return new Blob([csvContent], { type: 'text/csv' });
      } else {
        const jsonContent = JSON.stringify(history, null, 2);
        return new Blob([jsonContent], { type: 'application/json' });
      }
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('Failed to export data');
    }
  }

  private convertToCSV(data: AnalysisEntry[]): string {
    const headers = [
      'ID',
      'Date',
      'Overall Score',
      'GitHub Score',
      'LeetCode Score',
      'Status',
      'GitHub Username',
      'LeetCode Username',
      'Duration (s)',
      'Achievements'
    ];

    const rows = data.map(entry => [
      entry.id,
      new Date(entry.date).toLocaleDateString(),
      entry.overallScore,
      entry.githubScore,
      entry.leetcodeScore,
      entry.status,
      entry.usernames?.github || '',
      entry.usernames?.leetcode || '',
      entry.duration || '',
      entry.achievements.join('; ')
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const historyService = new HistoryService();
export default historyService;