import React, { useState } from 'react';
import { Search, Filter, Calendar, Download, RefreshCw, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { FilterOptions } from '../../types/history';

interface HistoryFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: (format: 'csv' | 'json') => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function HistoryFilters({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  loading
}: HistoryFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: filters.dateRange?.start || '',
    end: filters.dateRange?.end || ''
  });

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchQuery: value
    });
  };

  const handleStatusChange = (status: FilterOptions['status']) => {
    onFiltersChange({
      ...filters,
      status
    });
  };

  const handleScoreRangeChange = (type: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      [type === 'min' ? 'minScore' : 'maxScore']: value
    });
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    
    if (newDateRange.start && newDateRange.end) {
      onFiltersChange({
        ...filters,
        dateRange: newDateRange
      });
    } else if (!newDateRange.start && !newDateRange.end) {
      onFiltersChange({
        ...filters,
        dateRange: null
      });
    }
  };

  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    onFiltersChange({
      dateRange: null,
      status: 'all',
      minScore: 0,
      maxScore: 100,
      searchQuery: ''
    });
  };

  const hasActiveFilters = 
    filters.status !== 'all' ||
    filters.minScore > 0 ||
    filters.maxScore < 100 ||
    filters.dateRange !== null ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white transition-colors duration-300">
          Analysis History
        </h2>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={onRefresh}
            disabled={loading}
            variant="outline"
            icon={RefreshCw}
            className={loading ? 'animate-spin' : ''}
          >
            Refresh
          </Button>
          
          <div className="relative">
            <select
              onChange={(e) => onExport(e.target.value as 'csv' | 'json')}
              className="appearance-none bg-white dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-300"
              defaultValue=""
            >
              <option value="" disabled>Export Data</option>
              <option value="csv">Export as CSV</option>
              <option value="json">Export as JSON</option>
            </select>
            <Download className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <Input
            placeholder="Search usernames, achievements..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value as FilterOptions['status'])}
          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
        >
          <option value="all">All Status</option>
          <option value="complete">Complete</option>
          <option value="in-progress">In Progress</option>
          <option value="failed">Failed</option>
        </select>

        {/* Date Range Toggle */}
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          icon={Calendar}
          className="justify-center"
        >
          Date Range
        </Button>

        {/* Advanced Filters Toggle */}
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="outline"
          icon={Filter}
          className="justify-center"
        >
          {showAdvanced ? 'Hide Filters' : 'More Filters'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-secondary-200 dark:border-secondary-600 pt-4 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
              />
            </div>

            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                Min Score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minScore}
                onChange={(e) => handleScoreRangeChange('min', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-secondary-600 dark:text-secondary-400 mt-1 transition-colors duration-300">
                {filters.minScore}/100
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                Max Score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.maxScore}
                onChange={(e) => handleScoreRangeChange('max', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-secondary-600 dark:text-secondary-400 mt-1 transition-colors duration-300">
                {filters.maxScore}/100
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                icon={X}
                size="sm"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.status !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              Status: {filters.status}
            </span>
          )}
          {filters.dateRange && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              Date: {new Date(filters.dateRange.start).toLocaleDateString()} - {new Date(filters.dateRange.end).toLocaleDateString()}
            </span>
          )}
          {(filters.minScore > 0 || filters.maxScore < 100) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              Score: {filters.minScore}-{filters.maxScore}
            </span>
          )}
          {filters.searchQuery && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              Search: "{filters.searchQuery}"
            </span>
          )}
        </div>
      )}
    </div>
  );
}