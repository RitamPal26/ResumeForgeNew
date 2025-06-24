import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Plus, AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { HistoryMetricsCards } from '../components/history/HistoryMetricsCards';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryTable } from '../components/history/HistoryTable';
import { ProgressCharts } from '../components/history/ProgressCharts';
import { useAuth } from '../contexts/AuthContext';
import historyService from '../services/historyService';
import type { 
  AnalysisEntry, 
  HistoryMetrics, 
  FilterOptions, 
  SortOptions 
} from '../types/history';

export function HistoryDashboard() {
  const { user } = useAuth();
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AnalysisEntry[]>([]);
  const [metrics, setMetrics] = useState<HistoryMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: null,
    status: 'all',
    minScore: 0,
    maxScore: 100,
    searchQuery: ''
  });
  
  const [sort, setSort] = useState<SortOptions>({
    field: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    if (user) {
      loadHistoryData();
    }
  }, [user]);

  useEffect(() => {
    // Apply filters and sorting when they change
    if (analysisHistory.length > 0) {
      const filtered = historyService.filterAndSortHistory(analysisHistory, filters, sort);
      setFilteredHistory(filtered);
    }
  }, [analysisHistory, filters, sort]);

  const loadHistoryData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [history, historyMetrics] = await Promise.all([
        historyService.getAnalysisHistory(user.id),
        historyService.getHistoryMetrics(user.id)
      ]);
      
      setAnalysisHistory(history);
      setMetrics(historyMetrics);
      
      // Apply initial filtering and sorting
      const filtered = historyService.filterAndSortHistory(history, filters, sort);
      setFilteredHistory(filtered);
    } catch (err) {
      console.error('Failed to load history data:', err);
      setError('Failed to load analysis history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSort = (newSort: SortOptions) => {
    setSort(newSort);
  };

  const handleViewEntry = (entry: AnalysisEntry) => {
    // Navigate to detailed view or open modal
    console.log('Viewing entry:', entry.id);
    // In a real app, this would navigate to a detailed analysis view
  };

  const handleDownloadEntry = async (entry: AnalysisEntry) => {
    try {
      // In a real app, this would download the actual report
      const reportData = {
        id: entry.id,
        date: entry.date,
        scores: {
          overall: entry.overallScore,
          github: entry.githubScore,
          leetcode: entry.leetcodeScore
        },
        skills: entry.skillScores,
        achievements: entry.achievements,
        usernames: entry.usernames
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-report-${entry.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
      setError('Failed to download report. Please try again.');
    }
  };

  const handleRetryEntry = async (entry: AnalysisEntry) => {
    if (!user) return;
    
    try {
      await historyService.retryAnalysis(user.id, entry.id);
      // Reload data to reflect the retry
      await loadHistoryData();
    } catch (err) {
      console.error('Failed to retry analysis:', err);
      setError('Failed to retry analysis. Please try again.');
    }
  };

  const handleDeleteEntry = async (entry: AnalysisEntry) => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      return;
    }
    
    try {
      await historyService.deleteAnalysis(user.id, entry.id);
      // Remove from local state
      setAnalysisHistory(prev => prev.filter(item => item.id !== entry.id));
    } catch (err) {
      console.error('Failed to delete analysis:', err);
      setError('Failed to delete analysis. Please try again.');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    if (!user) return;
    
    try {
      const blob = await historyService.exportData(user.id, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analysis-history.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
      setError('Failed to export data. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            Please sign in to view your analysis history.
          </p>
          <Link to="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
      {/* Header with Breadcrumbs */}
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400 mb-4 transition-colors duration-300">
            <Link 
              to="/" 
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-secondary-900 dark:text-white font-medium transition-colors duration-300">
              History
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white transition-colors duration-300">
                Analysis History
              </h1>
              <p className="text-secondary-600 dark:text-secondary-300 mt-1 transition-colors duration-300">
                Track your progress and view detailed analysis reports
              </p>
            </div>
            
            <Link to="/dashboard">
              <Button icon={Plus} iconPosition="left">
                New Analysis
              </Button>
            </Link>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-300">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600 transition-colors duration-200"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Metrics Cards */}
          <HistoryMetricsCards metrics={metrics || {
            totalAnalyses: 0,
            averageScore: 0,
            scoreChange: 0,
            latestAnalysisDate: null,
            currentStreak: 0
          }} loading={loading} />

          {/* Progress Charts */}
          <ProgressCharts entries={analysisHistory} loading={loading} />

          {/* Filters and Table */}
          <HistoryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onRefresh={loadHistoryData}
            loading={loading}
          />

          <HistoryTable
            entries={filteredHistory}
            loading={loading}
            onSort={handleSort}
            onView={handleViewEntry}
            onDownload={handleDownloadEntry}
            onRetry={handleRetryEntry}
            onDelete={handleDeleteEntry}
            currentSort={sort}
          />

          {/* Empty State for No Data */}
          {!loading && analysisHistory.length === 0 && (
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 p-12 text-center transition-colors duration-300">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2 transition-colors duration-300">
                Ready to Start Your Journey?
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto transition-colors duration-300">
                You haven't completed any profile analyses yet. Start your first analysis to unlock insights about your development skills and track your progress over time.
              </p>
              <Link to="/dashboard">
                <Button size="lg" icon={Plus} iconPosition="left">
                  Start First Analysis
                </Button>
              </Link>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                    Comprehensive Analysis
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">
                    Get detailed insights from GitHub and LeetCode
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <h4 className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                    Track Progress
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">
                    Monitor your skill development over time
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                    Actionable Insights
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">
                    Get personalized recommendations
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}