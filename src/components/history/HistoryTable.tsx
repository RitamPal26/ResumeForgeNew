import React, { useState } from 'react';
import { 
  Eye, 
  Download, 
  RefreshCw, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { AnalysisEntry, SortOptions } from '../../types/history';

interface HistoryTableProps {
  entries: AnalysisEntry[];
  loading?: boolean;
  onSort: (sort: SortOptions) => void;
  onView: (entry: AnalysisEntry) => void;
  onDownload: (entry: AnalysisEntry) => void;
  onRetry: (entry: AnalysisEntry) => void;
  onDelete: (entry: AnalysisEntry) => void;
  currentSort: SortOptions;
}

export function HistoryTable({
  entries,
  loading,
  onSort,
  onView,
  onDownload,
  onRetry,
  onDelete,
  currentSort
}: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 55) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleSort = (field: SortOptions['field']) => {
    const direction = currentSort.field === field && currentSort.direction === 'desc' ? 'asc' : 'desc';
    onSort({ field, direction });
  };

  const getSortIcon = (field: SortOptions['field']) => {
    if (currentSort.field !== field) return null;
    return currentSort.direction === 'desc' ? 
      <ChevronDown className="w-4 h-4" /> : 
      <ChevronUp className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Pagination
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = entries.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
                <div className="w-16 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
                <div className="w-16 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
                <div className="w-16 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
                <div className="w-20 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
                <div className="w-32 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="p-12 text-center">
          <Calendar className="w-16 h-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
            No Analysis History
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            You haven't completed any profile analyses yet. Start your first analysis to see your progress here.
          </p>
          <Button icon={ExternalLink}>
            Start First Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 dark:bg-secondary-700 transition-colors duration-300">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-200"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {getSortIcon('date')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-200"
                onClick={() => handleSort('overallScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>Overall</span>
                  {getSortIcon('overallScore')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-200"
                onClick={() => handleSort('githubScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>GitHub</span>
                  {getSortIcon('githubScore')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-200"
                onClick={() => handleSort('leetcodeScore')}
              >
                <div className="flex items-center space-x-1">
                  <span>LeetCode</span>
                  {getSortIcon('leetcodeScore')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors duration-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700 transition-colors duration-300">
            {currentEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900 dark:text-white">
                    {formatDate(entry.date)}
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">
                    {entry.usernames?.github} / {entry.usernames?.leetcode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-lg font-bold ${getScoreColor(entry.overallScore)}`}>
                    {entry.overallScore}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getScoreColor(entry.githubScore)}`}>
                    {entry.githubScore}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getScoreColor(entry.leetcodeScore)}`}>
                    {entry.leetcodeScore}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                    {getStatusIcon(entry.status)}
                    <span className="ml-1 capitalize">{entry.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                  {formatDuration(entry.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(entry)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {entry.status === 'complete' && (
                      <button
                        onClick={() => onDownload(entry)}
                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                        title="Download Report"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    
                    {entry.status === 'failed' && (
                      <button
                        onClick={() => onRetry(entry)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 transition-colors duration-200"
                        title="Retry Analysis"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDelete(entry)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            Showing {startIndex + 1} to {Math.min(endIndex, entries.length)} of {entries.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;
              
              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}