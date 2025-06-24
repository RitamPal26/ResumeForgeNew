import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, BarChart3, User, Activity, Target, Clock } from 'lucide-react';
import { Button } from '../../ui/Button';
import { PDFReportButton } from '../../developer/PDFReportButton';
import { LanguageRadarChart } from './LanguageRadarChart';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ImpactDashboard } from './ImpactDashboard';
import type { DeveloperAnalysis, AnalysisProgress } from '../../../types/github';

interface GitHubAnalyticsProps {
  analysis: DeveloperAnalysis;
  onRefresh?: () => void;
  refreshDisabled?: boolean;
}

export function GitHubAnalytics({ analysis, onRefresh, refreshDisabled }: GitHubAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'activity' | 'impact'>('overview');


  const downloadReport = async () => {
    try {
      const reportData = {
        username: analysis.username,
        generatedAt: new Date().toISOString(),
        summary: `GitHub Analysis Report for ${analysis.profile.name || analysis.username}`,
        metrics: analysis
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${analysis.username}-github-analysis.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
    }
  };

  const formatLastAnalyzed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };
  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'languages', label: 'Languages', icon: User },
    { key: 'activity', label: 'Activity', icon: Activity },
    { key: 'impact', label: 'Impact', icon: Target },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              GitHub Analytics for {analysis.profile.name || analysis.username}
            </h2>
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  Last analyzed: {formatLastAnalyzed(analysis.lastAnalyzed)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">Live data</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {onRefresh && (
              <Button
                variant="outline"
                icon={RefreshCw}
                onClick={onRefresh}
                disabled={refreshDisabled}
              >
                {refreshDisabled ? 'Cooldown...' : 'Refresh'}
              </Button>
            )}
            <PDFReportButton
              unifiedScore={{
                overall: Math.round((analysis.impactMetrics.communityImpact + analysis.impactMetrics.codeQuality) / 2),
                github: {
                  overall: Math.round((analysis.impactMetrics.communityImpact + analysis.impactMetrics.codeQuality) / 2),
                  repository: Math.round(analysis.impactMetrics.codeQuality),
                  language: Math.round(analysis.languageStats.reduce((sum, lang) => sum + lang.proficiency, 0) / analysis.languageStats.length),
                  collaboration: Math.round(analysis.collaborationMetrics.engagementScore),
                  complexity: Math.round(analysis.projectComplexity.complexityScore),
                  activity: Math.round(analysis.collaborationMetrics.communityHealth),
                  details: {
                    totalRepos: analysis.profile.public_repos,
                    totalStars: analysis.impactMetrics.totalStars,
                    totalForks: analysis.impactMetrics.totalForks,
                    primaryLanguages: analysis.languageStats.slice(0, 3).map(lang => lang.language)
                  }
                },
                leetcode: {
                  overall: 0,
                  problemSolving: 0,
                  contest: 0,
                  consistency: 0,
                  difficulty: 0,
                  details: {
                    totalSolved: 0,
                    contestRating: 0,
                    contestsAttended: 0,
                    globalRanking: 0,
                    algorithmCoverage: { total: 0, core: 0, percentage: 0 }
                  }
                },
                breakdown: {
                  strengths: [`Strong ${analysis.developerClassification.primaryRole} skills`, 'Active development portfolio'],
                  weaknesses: ['Limited competitive programming data'],
                  balanceScore: 50,
                  skillDistribution: {
                    implementation: Math.round(analysis.impactMetrics.codeQuality),
                    problemSolving: 0,
                    collaboration: Math.round(analysis.collaborationMetrics.engagementScore),
                    algorithms: 0
                  }
                },
                recommendations: [
                  {
                    category: 'GitHub',
                    priority: 'Medium',
                    action: 'Continue building diverse projects',
                    description: 'Maintain your strong development activity and explore new technologies'
                  }
                ],
                interviewReadiness: {
                  overall: Math.round(analysis.impactMetrics.codeQuality * 0.8),
                  algorithm: 0,
                  systemDesign: Math.round(analysis.projectComplexity.complexityScore),
                  coding: Math.round(analysis.impactMetrics.codeQuality),
                  behavioral: Math.round(analysis.collaborationMetrics.engagementScore),
                  readinessLevel: 'Good - GitHub portfolio shows strong development skills',
                  recommendations: ['Add LeetCode practice for complete assessment']
                }
              }}
              githubAnalysis={analysis}
              usernames={{ github: analysis.username, leetcode: '' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <ImpactDashboard analysis={analysis} />}
          
          {activeTab === 'languages' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Proficiency</h3>
                  <LanguageRadarChart languages={analysis.languageStats} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Categories</h3>
                  <div className="space-y-3">
                    {analysis.repositoryCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium text-gray-900">{category.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{category.count} repos</div>
                          <div className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Patterns</h3>
              <ActivityHeatmap patterns={analysis.activityPatterns} />
            </div>
          )}
          
          {activeTab === 'impact' && <ImpactDashboard analysis={analysis} />}
        </div>
      </div>
    </div>
  );
}