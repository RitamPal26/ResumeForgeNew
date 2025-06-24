import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Share2, BarChart3, User, Code, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import { DeveloperProfileInput } from './DeveloperProfileInput';
import { UnifiedScoreDisplay } from './UnifiedScoreDisplay';
import { LeetCodeMetrics } from './LeetCodeMetrics';
import { GitHubAnalytics } from '../github/analytics/GitHubAnalytics';
import githubAnalyzer from '../../services/githubAnalyzer';
import scoringService from '../../services/scoring';
import leetcodeService from '../../services/leetcode';
import errorHandler from '../../services/errorHandler';
import type { UnifiedScore, LeetCodeProfile, ContestData, ProblemStats } from '../../types/leetcode';
import type { DeveloperAnalysis } from '../../types/github';

export function DeveloperProfileDashboard() {
  const [unifiedScore, setUnifiedScore] = useState<UnifiedScore | null>(null);
  const [githubAnalysis, setGithubAnalysis] = useState<DeveloperAnalysis | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<{
    profile: LeetCodeProfile;
    contestData: ContestData;
    problemStats: ProblemStats;
  } | null>(null);
  const [currentUsernames, setCurrentUsernames] = useState<{github: string; leetcode: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'github' | 'leetcode' | 'comparison'>('overview');

  const analyzeProfiles = async (githubUsername: string, leetcodeUsername: string) => {
    setLoading(true);
    setError(null);
    await analyzeProfilesWithRefresh(githubUsername, leetcodeUsername, false);
  };

  const analyzeProfilesWithRefresh = async (githubUsername: string, leetcodeUsername: string, forceRefresh: boolean = false) => {
    if (!forceRefresh) {
      setUnifiedScore(null);
      setGithubAnalysis(null);
      setLeetcodeData(null);
    }
    setUnifiedScore(null);
    setGithubAnalysis(null);
    setLeetcodeData(null);

    try {
      // Validate inputs
      errorHandler.validateInput(githubUsername, 'username');
      errorHandler.validateInput(leetcodeUsername, 'username');

      // Fetch GitHub analysis data
      const githubAnalysisData = await errorHandler.withRetry(
        () => githubAnalyzer.analyzeUser(githubUsername, { forceRefresh }),
        { service: 'github', method: 'analysis' }
      );

      // Fetch unified score with retry mechanism
      const score = await errorHandler.withRetry(
        () => scoringService.calculateUnifiedScore(githubUsername, leetcodeUsername),
        { service: 'unified', usernames: { github: githubUsername, leetcode: leetcodeUsername } }
      );

      // Fetch additional LeetCode data for detailed view
      const [profile, contestData, problemStats] = await Promise.all([
        errorHandler.withRetry(
          () => leetcodeService.fetchUserProfile(leetcodeUsername, forceRefresh),
          { service: 'leetcode', method: 'profile' }
        ),
        errorHandler.withRetry(
          () => leetcodeService.fetchContestData(leetcodeUsername, forceRefresh),
          { service: 'leetcode', method: 'contest' }
        ),
        errorHandler.withRetry(
          () => leetcodeService.fetchProblemStats(leetcodeUsername, forceRefresh),
          { service: 'leetcode', method: 'problems' }
        ),
      ]);

      setUnifiedScore(score);
      setGithubAnalysis(githubAnalysisData);
      setLeetcodeData({ profile, contestData, problemStats });
      setCurrentUsernames({ github: githubUsername, leetcode: leetcodeUsername });
    } catch (err) {
      const handledError = errorHandler.handleError(err, {
        service: 'unified',
        usernames: { github: githubUsername, leetcode: leetcodeUsername }
      });
      setError(handledError.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalysis = async () => {
    if (currentUsernames) {
      await analyzeProfilesWithRefresh(currentUsernames.github, currentUsernames.leetcode, true);
    }
  };

  const downloadReport = async () => {
    if (!unifiedScore || !currentUsernames) return;

    try {
      const reportData = {
        usernames: currentUsernames,
        analysis: unifiedScore,
        generatedAt: new Date().toISOString(),
        summary: `Developer Profile Analysis for ${currentUsernames.github} (GitHub) and ${currentUsernames.leetcode} (LeetCode)`
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `developer-profile-${currentUsernames.github}-${currentUsernames.leetcode}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download report:', err);
    }
  };

  const shareProfile = async () => {
    if (!currentUsernames) return;

    const shareData = {
      title: 'Developer Profile Analysis',
      text: `Check out this comprehensive developer profile analysis for ${currentUsernames.github} (GitHub) and ${currentUsernames.leetcode} (LeetCode)`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        // Create a temporary toast notification instead of alert
        const toast = document.createElement('div');
        toast.textContent = 'Profile link copied to clipboard!';
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
      }
    } catch (err) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
        const toast = document.createElement('div');
        toast.textContent = 'Profile link copied to clipboard!';
        toast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 2000);
      } catch (clipboardErr) {
        console.error('Failed to share or copy to clipboard:', clipboardErr);
        const toast = document.createElement('div');
        toast.textContent = 'Unable to share or copy link. Please copy the URL manually.';
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300';
        document.body.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
      }
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'github', label: 'GitHub Analysis', icon: User },
    { key: 'leetcode', label: 'LeetCode Metrics', icon: Code },
    { key: 'comparison', label: 'Skill Comparison', icon: Target },
  ];

  if (!unifiedScore) {
    return (
      <div className="space-y-8">
        <DeveloperProfileInput
          onAnalyze={analyzeProfiles}
          loading={loading}
          error={error}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Developer Profile Analysis</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analysis for {currentUsernames?.github} (GitHub) and {currentUsernames?.leetcode} (LeetCode)
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={refreshAnalysis}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              icon={Share2}
              onClick={shareProfile}
            >
              Share
            </Button>
            <Button
              icon={Download}
              onClick={downloadReport}
            >
              Download Report
            </Button>
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
          {activeTab === 'overview' && <UnifiedScoreDisplay score={unifiedScore} usernames={currentUsernames} />}
          
          {activeTab === 'github' && githubAnalysis && (
            <GitHubAnalytics analysis={githubAnalysis} onRefresh={refreshAnalysis} refreshDisabled={loading} />
          )}
          
          {activeTab === 'leetcode' && leetcodeData && (
            <LeetCodeMetrics
              profile={leetcodeData.profile}
              contestData={leetcodeData.contestData}
              problemStats={leetcodeData.problemStats}
            />
          )}
          
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Skill Distribution Comparison</h3>
                <p className="text-gray-600">
                  Visual comparison of GitHub implementation skills vs LeetCode problem-solving abilities
                </p>
              </div>
              
              {/* Skill Balance Chart */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Platform Balance Score</h4>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-16">GitHub</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-blue-500 h-4 rounded-l-full"
                      style={{ width: `${(unifiedScore.github.overall / (unifiedScore.github.overall + unifiedScore.leetcode.overall)) * 100}%` }}
                    />
                    <div
                      className="bg-orange-500 h-4 rounded-r-full absolute top-0 right-0"
                      style={{ width: `${(unifiedScore.leetcode.overall / (unifiedScore.github.overall + unifiedScore.leetcode.overall)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16">LeetCode</span>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-blue-600 font-medium">{unifiedScore.github.overall}%</span>
                  <span className="text-gray-600">Balance Score: {unifiedScore.breakdown.balanceScore}%</span>
                  <span className="text-orange-600 font-medium">{unifiedScore.leetcode.overall}%</span>
                </div>
              </div>

              {/* Detailed Skill Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">GitHub Skills</h4>
                  {[
                    { label: 'Repository Quality', value: unifiedScore.github.repository },
                    { label: 'Language Proficiency', value: unifiedScore.github.language },
                    { label: 'Collaboration', value: unifiedScore.github.collaboration },
                    { label: 'Project Complexity', value: unifiedScore.github.complexity },
                    { label: 'Development Activity', value: unifiedScore.github.activity }
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{skill.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{skill.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">LeetCode Skills</h4>
                  {[
                    { label: 'Problem Solving', value: unifiedScore.leetcode.problemSolving },
                    { label: 'Contest Performance', value: unifiedScore.leetcode.contest },
                    { label: 'Practice Consistency', value: unifiedScore.leetcode.consistency },
                    { label: 'Difficulty Mastery', value: unifiedScore.leetcode.difficulty }
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{skill.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${skill.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{skill.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => analyzeProfiles('', '')}
          >
            <User className="w-4 h-4 mr-2" />
            Analyze Another Profile
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={downloadReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Full Report
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={shareProfile}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}