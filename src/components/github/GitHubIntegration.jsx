import React, { useState, useEffect } from 'react';
import { Search, Github, ExternalLink, Star, GitFork, Calendar, MapPin, Building, Users, Activity, BarChart3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import githubService from '../../services/github';
import githubAnalyzer from '../../services/githubAnalyzer';
import errorHandler from '../../services/errorHandler';
import { GitHubProfile } from './GitHubProfile';
import { GitHubRepositories } from './GitHubRepositories';
import { GitHubLanguageStats } from './GitHubLanguageStats';
import { GitHubActivity } from './GitHubActivity';
import { LoadingSkeleton } from './LoadingSkeleton';
import { GitHubAnalytics } from './analytics/GitHubAnalytics';
import { AnalyticsProgress } from './analytics/AnalyticsProgress';

export function GitHubIntegration() {
  const [username, setUsername] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    repositories: false,
    languages: false,
    activity: false
  });
  const [errors, setErrors] = useState({});
  const [activeView, setActiveView] = useState('basic'); // 'basic' or 'analytics'
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshCooldown, setRefreshCooldown] = useState(false);

  // Load data for a username
  const loadGitHubData = async (targetUsername) => {
    if (!targetUsername.trim()) return;

    const cleanUsername = targetUsername.trim();
    setSearchUsername(cleanUsername);
    setErrors({});

    // Set all loading states
    setLoading({
      profile: true,
      repositories: true,
      languages: true,
      activity: true
    });

    // Load profile
    try {
      const profileData = await githubService.fetchUserProfile(cleanUsername);
      setProfile(profileData);
      setLoading(prev => ({ ...prev, profile: false }));
    } catch (error) {
      setErrors(prev => ({ ...prev, profile: error.message }));
      setLoading(prev => ({ ...prev, profile: false }));
      setProfile(null);
    }

    // Load repositories
    try {
      const reposData = await githubService.fetchUserRepositories(cleanUsername);
      setRepositories(reposData);
      setLoading(prev => ({ ...prev, repositories: false }));
    } catch (error) {
      setErrors(prev => ({ ...prev, repositories: error.message }));
      setLoading(prev => ({ ...prev, repositories: false }));
      setRepositories([]);
    }

    // Load language statistics
    try {
      const languagesData = await githubService.fetchLanguageStats(cleanUsername);
      setLanguageStats(languagesData);
      setLoading(prev => ({ ...prev, languages: false }));
    } catch (error) {
      setErrors(prev => ({ ...prev, languages: error.message }));
      setLoading(prev => ({ ...prev, languages: false }));
      setLanguageStats([]);
    }

    // Load recent activity
    try {
      const activityData = await githubService.fetchRecentActivity(cleanUsername);
      setActivity(activityData);
      setLoading(prev => ({ ...prev, activity: false }));
    } catch (error) {
      setErrors(prev => ({ ...prev, activity: error.message }));
      setLoading(prev => ({ ...prev, activity: false }));
      setActivity([]);
    }
  };

  // Load GitHub analysis data
  const loadGitHubAnalysis = async (targetUsername) => {
    if (!targetUsername.trim()) return;

    const forceRefresh = false; // Default to using cache
    const cleanUsername = targetUsername.trim();
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisProgress({ currentTask: 'Starting analysis...', progress: 0, estimatedTimeRemaining: 30 });

    try {
      const analysisData = await githubAnalyzer.analyzeUser(cleanUsername, {
        onProgress: (progress) => {
          setAnalysisProgress(progress);
        },
        forceRefresh
      });
      
      setAnalysis(analysisData);
      setLastRefresh(Date.now());
      setAnalysisProgress(null);
    } catch (error) {
      const handledError = errorHandler.handleError(error, 'GitHub Analysis');
      setAnalysisError(handledError.message);
      setAnalysisProgress(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Handle view change between basic and analytics
  const handleViewChange = (view) => {
    setActiveView(view);
    
    if (view === 'analytics' && searchUsername && !analysis && !analysisLoading) {
      loadGitHubAnalysis(searchUsername);
    }
  };

  // Handle refresh for analytics
  const handleRefresh = async () => {
    if (refreshCooldown || !searchUsername) return;

    setRefreshCooldown(true);
    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisProgress({ currentTask: 'Starting fresh analysis...', progress: 0, estimatedTimeRemaining: 30 });
    
    try {
      // Force refresh to bypass cache
      const analysisData = await githubAnalyzer.analyzeUser(searchUsername, {
        onProgress: (progress) => {
          setAnalysisProgress(progress);
        },
        forceRefresh: true // Force refresh to get real-time data
      });
      
      setAnalysis(analysisData);
      setLastRefresh(Date.now());
      setAnalysisProgress(null);
    } catch (error) {
      const handledError = errorHandler.handleError(error, 'GitHub Analysis');
      setAnalysisError(handledError.message);
      setAnalysisProgress(null);
    } finally {
      setAnalysisLoading(false);
    }
    
    // Set cooldown for 30 seconds
    setTimeout(() => {
      setRefreshCooldown(false);
    }, 30000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeView === 'analytics') {
      loadGitHubAnalysis(username);
    } else {
      loadGitHubData(username);
    }
  };

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const clearData = () => {
    setProfile(null);
    setRepositories([]);
    setLanguageStats([]);
    setActivity([]);
    setAnalysis(null);
    setAnalysisError(null);
    setAnalysisProgress(null);
    setLastRefresh(null);
    setSearchUsername('');
    setUsername('');
    setErrors({});
    setActiveView('basic');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Github className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl font-bold text-secondary-900">GitHub Integration</h2>
        </div>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Showcase your GitHub profile and development activity. Enter a GitHub username to display 
          repositories, language statistics, recent contributions, and advanced analytics.
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter GitHub username (e.g., octocat)"
              value={username}
              onChange={handleInputChange}
              className="pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          </div>
          <div className="flex space-x-3">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!username.trim() || Object.values(loading).some(Boolean)}
            >
              {Object.values(loading).some(Boolean) ? 'Loading...' : 'Load GitHub Profile'}
            </Button>
            {searchUsername && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={clearData}
              >
                Clear
              </Button>
            )}
          </div>
          {searchUsername && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleViewChange('basic')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'basic'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Basic View
              </button>
              <button
                onClick={() => handleViewChange('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'analytics'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Analytics
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {searchUsername && (
        <div>
          {activeView === 'analytics' ? (
            <div className="space-y-6">
              {/* Data Freshness Indicator */}
              {lastRefresh && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-blue-800 dark:text-blue-200">
                        Last analyzed: {new Date(lastRefresh).toLocaleString()}
                      </span>
                    </div>
                    <Button
                      onClick={handleRefresh}
                      disabled={refreshCooldown || Object.values(loading).some(Boolean)}
                      variant="outline"
                      size="sm"
                    >
                      {refreshCooldown ? 'Cooldown...' : 'Refresh'}
                    </Button>
                  </div>
                </div>
              )}
              
              {progress && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 mb-2">{progress.currentTask}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {progress.progress}% complete • {progress.estimatedTimeRemaining}s remaining
                    </div>
                  </div>
                </div>
              )}
              
              {analysis ? (
                <GitHubAnalytics 
                  analysis={analysis} 
                  onRefresh={handleRefresh} 
                  refreshDisabled={refreshCooldown || analysisLoading} 
                />
              ) : analysisLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  {analysisProgress ? (
                    <div className="space-y-4">
                      <div className="text-lg font-semibold text-gray-900">{analysisProgress.currentTask}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analysisProgress.progress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        {analysisProgress.progress}% complete • Approximately {analysisProgress.estimatedTimeRemaining}s remaining
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Analyzing GitHub profile...</p>
                    </>
                  )}
                </div>
              ) : analysisError ? (
                <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
                  <div className="text-red-600 mb-4">{analysisError}</div>
                  <Button onClick={() => loadGitHubAnalysis(searchUsername)} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile Section */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 border-b border-secondary-200">
                  <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Profile</span>
                  </h3>
                </div>
                <div className="p-6">
                  {loading.profile ? (
                    <LoadingSkeleton type="profile" />
                  ) : errors.profile ? (
                    <div className="text-center py-8">
                      <div className="text-red-600 mb-2">{errors.profile}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadGitHubData(searchUsername)}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : profile ? (
                    <GitHubProfile profile={profile} />
                  ) : null}
                </div>
              </div>

              {/* Repositories Section */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 border-b border-secondary-200">
                  <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                    <Github className="w-5 h-5" />
                    <span>Top Repositories</span>
                  </h3>
                </div>
                <div className="p-6">
                  {loading.repositories ? (
                    <LoadingSkeleton type="repositories" />
                  ) : errors.repositories ? (
                    <div className="text-center py-8">
                      <div className="text-red-600 mb-2">{errors.repositories}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadGitHubData(searchUsername)}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : repositories.length > 0 ? (
                    <GitHubRepositories repositories={repositories} />
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      No public repositories found.
                    </div>
                  )}
                </div>
              </div>

              {/* Language Statistics Section */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 border-b border-secondary-200">
                  <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Language Statistics</span>
                  </h3>
                </div>
                <div className="p-6">
                  {loading.languages ? (
                    <LoadingSkeleton type="languages" />
                  ) : errors.languages ? (
                    <div className="text-center py-8">
                      <div className="text-red-600 mb-2">{errors.languages}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadGitHubData(searchUsername)}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : languageStats.length > 0 ? (
                    <GitHubLanguageStats languages={languageStats} />
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      No language data available.
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Section */}
              <div className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
                <div className="p-6 border-b border-secondary-200">
                  <h3 className="text-xl font-semibold text-secondary-900 flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </h3>
                </div>
                <div className="p-6">
                  {loading.activity ? (
                    <LoadingSkeleton type="activity" />
                  ) : errors.activity ? (
                    <div className="text-center py-8">
                      <div className="text-red-600 mb-2">{errors.activity}</div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => loadGitHubData(searchUsername)}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : activity.length > 0 ? (
                    <GitHubActivity activities={activity} />
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      No recent activity found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}