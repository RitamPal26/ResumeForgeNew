import React from "react";
import type { ActivityPattern } from "../../../types/github";

interface ActivityHeatmapProps {
  patterns: ActivityPattern[];
  className?: string;
}

export function ActivityHeatmap({
  patterns,
  className = "",
}: ActivityHeatmapProps) {
  const getIntensityColor = (commits: number): string => {
    if (commits === 0) return "bg-gray-100 dark:bg-gray-800";
    if (commits <= 2) return "bg-green-200 dark:bg-green-900";
    if (commits <= 5) return "bg-green-300 dark:bg-green-800";
    if (commits <= 10) return "bg-green-400 dark:bg-green-700";
    if (commits <= 15) return "bg-green-500 dark:bg-green-600";
    return "bg-green-600 dark:bg-green-500";
  };

  const getIntensityText = (commits: number): string => {
    if (commits === 0) return "No activity";
    if (commits <= 2) return "Low activity";
    if (commits <= 5) return "Moderate activity";
    if (commits <= 10) return "High activity";
    if (commits <= 15) return "Very high activity";
    return "Intense activity";
  };

  // Check if we have real data or need to generate demo data
  const hasRealData = patterns.some((p) => p.commits > 0);

  // Generate realistic demo data if all patterns are empty
  const generateDemoPatterns = (
    originalPatterns: ActivityPattern[]
  ): ActivityPattern[] => {
    return originalPatterns.map((pattern, index) => {
      // Create realistic activity pattern (more active on weekdays, less on weekends)
      const date = new Date(pattern.date);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Generate commits based on realistic patterns
      let commits = 0;
      const random = Math.random();

      if (isWeekend) {
        // Less activity on weekends
        commits = random < 0.7 ? 0 : Math.floor(Math.random() * 3) + 1;
      } else {
        // More activity on weekdays
        commits = random < 0.3 ? 0 : Math.floor(Math.random() * 6) + 1;
      }

      return {
        ...pattern,
        commits,
        additions: commits * (10 + Math.floor(Math.random() * 20)), // 10-30 additions per commit
        deletions: commits * (2 + Math.floor(Math.random() * 8)), // 2-10 deletions per commit
        repositories:
          commits > 0
            ? [
                "student-progress-site",
                "stayfinder-haven-homes",
                "ResumeForge",
              ].slice(0, Math.min(commits, 3))
            : [],
      };
    });
  };

  // Use demo data if no real activity is found
  const displayPatterns = hasRealData
    ? patterns
    : generateDemoPatterns(patterns);

  // Convert weekly patterns to daily patterns for proper heatmap display
  const generateDailyPatterns = (weeklyPatterns: ActivityPattern[]) => {
    const dailyPatterns: ActivityPattern[] = [];
    const now = new Date();

    // Generate daily patterns for the last 365 days (52 weeks * 7 days)
    for (let i = 364; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split("T")[0];

      // Find the corresponding weekly pattern
      const weekStart = new Date(
        date.getTime() - date.getDay() * 24 * 60 * 60 * 1000
      );

      const weeklyPattern = weeklyPatterns.find((p) => {
        const patternDate = new Date(p.date);
        const patternWeekStart = new Date(
          patternDate.getTime() - patternDate.getDay() * 24 * 60 * 60 * 1000
        );
        return (
          Math.abs(patternWeekStart.getTime() - weekStart.getTime()) <
          7 * 24 * 60 * 60 * 1000
        );
      });

      // Distribute weekly commits across days (with some randomization for realism)
      const weeklyCommits = weeklyPattern?.commits || 0;
      const dailyCommits =
        weeklyCommits > 0
          ? Math.floor(weeklyCommits / 7) +
            (Math.random() < (weeklyCommits % 7) / 7 ? 1 : 0)
          : 0;

      dailyPatterns.push({
        date: dateString,
        commits: dailyCommits,
        additions: Math.floor((weeklyPattern?.additions || 0) / 7),
        deletions: Math.floor((weeklyPattern?.deletions || 0) / 7),
        repositories: weeklyPattern?.repositories || [],
      });
    }

    return dailyPatterns;
  };

  const dailyPatterns = generateDailyPatterns(displayPatterns);

  // Group patterns by week (starting from Sunday)
  const weeks: ActivityPattern[][] = [];

  // Fix: Ensure we have valid daily patterns before processing
  if (dailyPatterns.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No activity data available
          </p>
        </div>
      </div>
    );
  }

  const startDate = new Date(dailyPatterns[0]?.date || new Date());
  const startDayOfWeek = startDate.getDay();

  // Add empty days at the beginning if the first day is not Sunday
  const paddedPatterns = [
    ...Array(startDayOfWeek)
      .fill(null)
      .map(() => ({
        date: "",
        commits: 0,
        additions: 0,
        deletions: 0,
        repositories: [],
      })),
    ...dailyPatterns,
  ];

  for (let i = 0; i < paddedPatterns.length; i += 7) {
    weeks.push(paddedPatterns.slice(i, i + 7));
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate month positions for labels
  const getMonthLabels = () => {
    const monthLabels: { month: string; position: number }[] = [];
    let currentMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = week.find((day) => day.date);
      if (firstDayOfWeek && firstDayOfWeek.date) {
        const date = new Date(firstDayOfWeek.date);
        const month = date.getMonth();

        if (month !== currentMonth && weekIndex % 4 === 0) {
          monthLabels.push({
            month: months[month],
            position: weekIndex,
          });
          currentMonth = month;
        }
      }
    });

    return monthLabels;
  };

  const monthLabels = getMonthLabels();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Contribution Activity
        </h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 dark:bg-green-800 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 dark:bg-green-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm"></div>
            </div>
            <span>More</span>
          </div>
          {!hasRealData && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs text-orange-600 dark:text-orange-400">
                Demo data
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2">
            <div className="w-8"></div>
            <div className="flex relative">
              {weeks.map((_, weekIndex) => (
                <div key={weekIndex} className="w-4"></div>
              ))}
              {monthLabels.map(({ month, position }) => (
                <div
                  key={`${month}-${position}`}
                  className="absolute text-xs text-gray-500 dark:text-gray-400"
                  style={{ left: `${position * 16}px` }}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap grid */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col space-y-1 mr-2">
              {days.map((day, index) => (
                <div
                  key={day}
                  className="text-xs text-gray-500 dark:text-gray-400 h-3 flex items-center w-6"
                >
                  {index % 2 === 1 ? day : ""}
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
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 ${
                        pattern.date
                          ? getIntensityColor(pattern.commits)
                          : "bg-transparent"
                      }`}
                      title={
                        pattern.date
                          ? `${pattern.date}: ${pattern.commits} commits, ${
                              pattern.additions
                            } additions, ${
                              pattern.deletions
                            } deletions - ${getIntensityText(pattern.commits)}`
                          : ""
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {dailyPatterns.reduce((sum, p) => sum + p.commits, 0)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Total Commits
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {dailyPatterns.filter((p) => p.commits > 0).length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Active Days
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round(
              dailyPatterns.reduce((sum, p) => sum + p.commits, 0) / 52
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Avg/Week
          </div>
        </div>
      </div>
    </div>
  );
}
