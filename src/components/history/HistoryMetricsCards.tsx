import React from 'react';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Zap, Award } from 'lucide-react';
import type { HistoryMetrics } from '../../types/history';

interface HistoryMetricsCardsProps {
  metrics: HistoryMetrics;
  loading?: boolean;
}

export function HistoryMetricsCards({ metrics, loading }: HistoryMetricsCardsProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-secondary-600';
  };

  const cards = [
    {
      title: 'Total Analyses',
      value: metrics.totalAnalyses.toString(),
      icon: BarChart3,
      color: 'bg-blue-500',
      tooltip: 'Total number of completed profile analyses'
    },
    {
      title: 'Average Score',
      value: `${metrics.averageScore}/100`,
      icon: Award,
      color: 'bg-green-500',
      trend: metrics.scoreChange,
      tooltip: 'Your average overall score across all analyses'
    },
    {
      title: 'Latest Analysis',
      value: formatDate(metrics.latestAnalysisDate),
      icon: Calendar,
      color: 'bg-purple-500',
      tooltip: 'Date of your most recent analysis'
    },
    {
      title: 'Current Streak',
      value: `${metrics.currentStreak} week${metrics.currentStreak !== 1 ? 's' : ''}`,
      icon: Zap,
      color: 'bg-orange-500',
      tooltip: 'Consecutive weeks with at least one analysis'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-600 rounded-lg"></div>
                <div className="w-16 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-secondary-200 dark:bg-secondary-600 rounded mb-2"></div>
              <div className="w-24 h-4 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-all duration-300 group"
          title={card.tooltip}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.color} group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            {card.trend !== undefined && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(card.trend)}
                <span className={`text-sm font-medium ${getTrendColor(card.trend)}`}>
                  {card.trend > 0 ? '+' : ''}{card.trend}%
                </span>
              </div>
            )}
          </div>
          
          <div className="text-2xl font-bold text-secondary-900 dark:text-white mb-1 transition-colors duration-300">
            {card.value}
          </div>
          
          <div className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">
            {card.title}
          </div>
        </div>
      ))}
    </div>
  );
}