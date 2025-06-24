import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { AnalysisEntry, ChartDataPoint, SkillComparisonData } from '../../types/history';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ProgressChartsProps {
  entries: AnalysisEntry[];
  loading?: boolean;
}

export function ProgressCharts({ entries, loading }: ProgressChartsProps) {
  // Prepare data for line chart (score progression)
  const prepareLineChartData = () => {
    const completeEntries = entries
      .filter(entry => entry.status === 'complete')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 entries

    const labels = completeEntries.map(entry => 
      new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    return {
      labels,
      datasets: [
        {
          label: 'Overall Score',
          data: completeEntries.map(entry => entry.overallScore),
          borderColor: 'rgb(37, 99, 235)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: 'rgb(37, 99, 235)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'GitHub Score',
          data: completeEntries.map(entry => entry.githubScore),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        },
        {
          label: 'LeetCode Score',
          data: completeEntries.map(entry => entry.leetcodeScore),
          borderColor: 'rgb(245, 158, 11)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgb(245, 158, 11)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
        }
      ]
    };
  };

  // Prepare data for bar chart (skill comparison)
  const prepareBarChartData = () => {
    if (entries.length === 0) return { labels: [], datasets: [] };

    const latestEntry = entries.find(entry => entry.status === 'complete');
    if (!latestEntry) return { labels: [], datasets: [] };

    const skillNames = Object.keys(latestEntry.skillScores);
    const currentScores = Object.values(latestEntry.skillScores);

    // Get previous entry for comparison
    const previousEntry = entries
      .filter(entry => entry.status === 'complete' && entry.id !== latestEntry.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    const previousScores = previousEntry 
      ? skillNames.map(skill => previousEntry.skillScores[skill] || 0)
      : currentScores.map(() => 0);

    return {
      labels: skillNames,
      datasets: [
        {
          label: 'Current',
          data: currentScores,
          backgroundColor: 'rgba(37, 99, 235, 0.8)',
          borderColor: 'rgb(37, 99, 235)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Previous',
          data: previousScores,
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgb(156, 163, 175)',
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}/100`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            return value + '/100';
          }
        }
      }
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}/100`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          maxRotation: 45,
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value: any) {
            return value + '/100';
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="animate-pulse">
            <div className="h-4 bg-secondary-200 dark:bg-secondary-600 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
          <div className="animate-pulse">
            <div className="h-4 bg-secondary-200 dark:bg-secondary-600 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-secondary-200 dark:bg-secondary-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (entries.filter(e => e.status === 'complete').length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Score Progression</h3>
          <div className="h-64 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p>Complete analyses to see your progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Skill Comparison</h3>
          <div className="h-64 flex items-center justify-center text-secondary-500 dark:text-secondary-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>Complete analyses to compare skills</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Score Progression */}
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
          Score Progression Over Time
        </h3>
        <div className="h-64">
          <Line data={prepareLineChartData()} options={lineChartOptions} />
        </div>
      </div>

      {/* Bar Chart - Skill Comparison */}
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
          Current vs Previous Skills
        </h3>
        <div className="h-64">
          <Bar data={prepareBarChartData()} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}