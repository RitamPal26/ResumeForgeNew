import React from 'react';
import { Trophy, Target, Calendar, TrendingUp, Code, Award } from 'lucide-react';
import type { LeetCodeProfile, ContestData, ProblemStats } from '../../types/leetcode';

interface LeetCodeMetricsProps {
  profile: LeetCodeProfile;
  contestData: ContestData;
  problemStats: ProblemStats;
}

export function LeetCodeMetrics({ profile, contestData, problemStats }: LeetCodeMetricsProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalSolved = problemStats.solvedStats?.reduce((sum, stat) => sum + stat.count, 0) || 0;
  const totalQuestions = problemStats.totalQuestions?.reduce((sum, stat) => sum + stat.count, 0) || 0;
  const solveRate = totalQuestions > 0 ? ((totalSolved / totalQuestions) * 100).toFixed(1) : '0';

  const topTags = [
    ...(problemStats.tagStats?.fundamental || []),
    ...(problemStats.tagStats?.intermediate || []),
    ...(problemStats.tagStats?.advanced || [])
  ]
    .filter(tag => tag.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt={`${profile.username}'s avatar`}
              className="w-16 h-16 rounded-full border-2 border-orange-200"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.realName || profile.username}
            </h2>
            <p className="text-gray-600">@{profile.username}</p>
            {profile.aboutMe && (
              <p className="text-sm text-gray-700 mt-2">{profile.aboutMe}</p>
            )}
          </div>
          {profile.ranking > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">#{profile.ranking.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Global Rank</div>
            </div>
          )}
        </div>
      </div>

      {/* Problem Solving Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="w-5 h-5 text-orange-500 mr-2" />
          Problem Solving Statistics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalSolved}</div>
            <div className="text-sm text-gray-600">Problems Solved</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{solveRate}%</div>
            <div className="text-sm text-gray-600">Solve Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{profile.badges?.length || 0}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{topTags.length}</div>
            <div className="text-sm text-gray-600">Topics Covered</div>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="space-y-3">
          {problemStats.solvedStats?.map((stat, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(stat.difficulty)}`}>
                  {stat.difficulty}
                </span>
                <span className="font-medium text-gray-900">{stat.count} solved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stat.difficulty === 'Easy' ? 'bg-green-500' :
                      stat.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${totalQuestions > 0 ? (stat.count / totalQuestions) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {totalQuestions > 0 ? ((stat.count / totalQuestions) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contest Performance */}
      {contestData.ranking && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            Contest Performance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{contestData.ranking.rating || 0}</div>
              <div className="text-sm text-gray-600">Contest Rating</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                #{(contestData.ranking.globalRanking || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Global Ranking</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{contestData.ranking.attendedContestsCount || 0}</div>
              <div className="text-sm text-gray-600">Contests Attended</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {contestData.ranking.topPercentage ? `${contestData.ranking.topPercentage.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Top Percentage</div>
            </div>
          </div>

          {contestData.ranking.badge && (
            <div className="flex items-center justify-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="font-medium text-gray-900">Contest Badge: {contestData.ranking.badge.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Algorithm Topics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 text-blue-500 mr-2" />
          Algorithm Topics Mastery
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topTags.map((tag, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{tag.tagName}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{tag.problemsSolved} problems</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min((tag.problemsSolved / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Contest History */}
      {contestData.history && contestData.history.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 text-green-500 mr-2" />
            Recent Contest History
          </h3>
          
          <div className="space-y-3">
            {contestData.history.slice(0, 5).map((contest, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{contest.contest.title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(parseInt(contest.contest.startTime) * 1000).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    Rank #{contest.ranking.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {contest.problemsSolved}/{contest.totalProblems} solved
                  </div>
                  <div className={`text-sm ${
                    contest.trendDirection === 'up' ? 'text-green-600' :
                    contest.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    Rating: {contest.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {profile.badges && profile.badges.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="w-5 h-5 text-purple-500 mr-2" />
            Achievements & Badges
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                {badge.icon && (
                  <img src={badge.icon} alt={badge.displayName} className="w-8 h-8" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{badge.displayName}</h4>
                  <p className="text-xs text-gray-600">
                    Earned {new Date(badge.creationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}