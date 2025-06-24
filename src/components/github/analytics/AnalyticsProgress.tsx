import React from 'react';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import type { AnalysisProgress } from '../../../types/github';

interface AnalyticsProgressProps {
  progress: AnalysisProgress;
}

export function AnalyticsProgress({ progress }: AnalyticsProgressProps) {
  const getStageIcon = (stage: string, currentStage: string) => {
    const stages = ['basic', 'detailed', 'advanced', 'complete'];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stage);

    if (stageIndex < currentIndex || currentStage === 'complete') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (stageIndex === currentIndex) {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    } else {
      return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStageColor = (stage: string, currentStage: string) => {
    const stages = ['basic', 'detailed', 'advanced', 'complete'];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stage);

    if (stageIndex < currentIndex || currentStage === 'complete') {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (stageIndex === currentIndex) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    } else {
      return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const stages = [
    {
      key: 'basic',
      title: 'Basic Analysis',
      description: 'Fetching profile and repository data'
    },
    {
      key: 'detailed',
      title: 'Detailed Metrics',
      description: 'Calculating collaboration and complexity metrics'
    },
    {
      key: 'advanced',
      title: 'Advanced Analysis',
      description: 'Generating developer classification and insights'
    },
    {
      key: 'complete',
      title: 'Complete',
      description: 'Analysis finished successfully'
    }
  ];

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Analysis Progress</h3>
          <span className="text-sm text-gray-500">
            {progress.progress}% complete
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.progress}%` }}
          />
        </div>

        {/* Current Task */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{progress.currentTask}</span>
          {progress.estimatedTimeRemaining > 0 && (
            <span className="text-gray-500">
              ~{formatTime(progress.estimatedTimeRemaining)} remaining
            </span>
          )}
        </div>
      </div>

      {/* Stage Progress */}
      <div className="space-y-3">
        {stages.map((stage, index) => (
          <div
            key={stage.key}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${getStageColor(stage.key, progress.stage)}`}
          >
            {getStageIcon(stage.key, progress.stage)}
            <div className="flex-1">
              <div className="font-medium text-sm">{stage.title}</div>
              <div className="text-xs opacity-75">{stage.description}</div>
            </div>
            {index < stages.length - 1 && (
              <div className="w-px h-6 bg-gray-200 ml-2" />
            )}
          </div>
        ))}
      </div>

      {progress.stage === 'complete' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-700">
              Analysis completed successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  );
}