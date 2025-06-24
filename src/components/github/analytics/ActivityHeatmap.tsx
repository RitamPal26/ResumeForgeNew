import React from 'react';
import type { ActivityPattern } from '../../../types/github';

interface ActivityHeatmapProps {
  patterns: ActivityPattern[];
  className?: string;
}

export function ActivityHeatmap({ patterns, className = '' }: ActivityHeatmapProps) {
  const getIntensityColor = (commits: number): string => {
    if (commits === 0) return 'bg-gray-100';
    if (commits <= 2) return 'bg-green-200';
    if (commits <= 5) return 'bg-green-300';
    if (commits <= 10) return 'bg-green-400';
    if (commits <= 15) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getIntensityText = (commits: number): string => {
    if (commits === 0) return 'No activity';
    if (commits <= 2) return 'Low activity';
    if (commits <= 5) return 'Moderate activity';
    if (commits <= 10) return 'High activity';
    if (commits <= 15) return 'Very high activity';
    return 'Intense activity';
  };

  // Group patterns by week
  const weeks = [];
  for (let i = 0; i < patterns.length; i += 7) {
    weeks.push(patterns.slice(i, i + 7));
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Contribution Activity</h4>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div>
            {months.map((month, index) => (
              <div key={month} className="text-xs text-gray-500 w-16 text-center">
                {index % 2 === 0 ? month : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col space-y-1 mr-2">
              {days.map((day, index) => (
                <div key={day} className="text-xs text-gray-500 h-3 flex items-center">
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Activity squares */}
            <div className="flex space-x-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-1">
                  {week.map((pattern, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-gray-300 ${getIntensityColor(pattern.commits)}`}
                      title={`${pattern.date}: ${pattern.commits} commits - ${getIntensityText(pattern.commits)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {patterns.reduce((sum, p) => sum + p.commits, 0)}
          </div>
          <div className="text-xs text-gray-500">Total Commits</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {patterns.filter(p => p.commits > 0).length}
          </div>
          <div className="text-xs text-gray-500">Active Days</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {Math.round(patterns.reduce((sum, p) => sum + p.commits, 0) / 52)}
          </div>
          <div className="text-xs text-gray-500">Avg/Week</div>
        </div>
      </div>
    </div>
  );
}