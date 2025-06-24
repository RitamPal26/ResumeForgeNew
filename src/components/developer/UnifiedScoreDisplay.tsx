import React from 'react';
import { TrendingUp, Github, Code, Target, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { PDFReportButton } from './PDFReportButton';
import type { UnifiedScore } from '../../types/leetcode';

interface UnifiedScoreDisplayProps {
  score: UnifiedScore;
  usernames?: {
    github: string;
    leetcode: string;
  };
}

export function UnifiedScoreDisplay({ score, usernames }: UnifiedScoreDisplayProps) {
  const getScoreColor = (value: number) => {
    if (value >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (value >= 55) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (value: number) => {
    if (value >= 85) return <Award className="w-5 h-5" />;
    if (value >= 70) return <CheckCircle className="w-5 h-5" />;
    if (value >= 55) return <Target className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const getReadinessColor = (level: string) => {
    if (level.includes('Excellent')) return 'bg-green-100 text-green-800';
    if (level.includes('Good')) return 'bg-blue-100 text-blue-800';
    if (level.includes('Fair')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-center">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${getScoreColor(score.overall)}`}>
            {getScoreIcon(score.overall)}
            <span className="text-2xl font-bold">{score.overall}</span>
            <span className="text-sm font-medium">Overall Score</span>
          </div>
          <p className="text-gray-600 mt-2">
            Combined assessment of your GitHub projects and LeetCode problem-solving skills
          </p>
        </div>
      </div>

      {/* Platform Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gray-900 rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">GitHub Score</h3>
              <p className="text-sm text-gray-600">Implementation & Collaboration</p>
            </div>
            <div className="ml-auto">
              <span className="text-2xl font-bold text-gray-900">{score.github.overall}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Repositories</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${score.github.repository}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{score.github.repository}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Languages</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${score.github.language}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{score.github.language}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Collaboration</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${score.github.collaboration}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{score.github.collaboration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">LeetCode Score</h3>
              <p className="text-sm text-gray-600">Problem Solving & Algorithms</p>
            </div>
            <div className="ml-auto">
              <span className="text-2xl font-bold text-gray-900">{score.leetcode.overall}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Problem Solving</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${score.leetcode.problemSolving}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{score.leetcode.problemSolving}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contests</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${score.leetcode.contest}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{score.leetcode.contest}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Consistency</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${score.leetcode.consistency}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8">{score.leetcode.consistency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Readiness */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-500 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interview Readiness</h3>
            <p className="text-sm text-gray-600">Assessment across key interview areas</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getReadinessColor(score.interviewReadiness.readinessLevel)}`}>
              {score.interviewReadiness.readinessLevel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score.interviewReadiness.algorithm}%</div>
            <div className="text-sm text-gray-600">Algorithms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score.interviewReadiness.systemDesign}%</div>
            <div className="text-sm text-gray-600">System Design</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score.interviewReadiness.coding}%</div>
            <div className="text-sm text-gray-600">Coding</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{score.interviewReadiness.behavioral}%</div>
            <div className="text-sm text-gray-600">Behavioral</div>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {score.breakdown.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {score.breakdown.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
          Recommendations
        </h3>
        <div className="space-y-4">
          {score.recommendations.map((rec, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                  rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {rec.priority} Priority
                </span>
                <span className="text-sm font-medium text-gray-900">{rec.category}</span>
              </div>
              <h4 className="font-medium text-gray-900">{rec.action}</h4>
              <p className="text-sm text-gray-600">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Report Generation */}
      {usernames && (
        <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-secondary-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center transition-colors duration-300">
            <Award className="w-5 h-5 text-purple-500 mr-2" />
            Professional Report
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
            Generate a comprehensive PDF report perfect for sharing with recruiters, managers, or for your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <PDFReportButton
              unifiedScore={score}
              usernames={usernames}
              className="flex-shrink-0"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
              <p className="font-medium mb-1">Report includes:</p>
              <ul className="space-y-1">
                <li>• Executive summary with overall score</li>
                <li>• Detailed technical analysis</li>
                <li>• Professional recommendations</li>
                <li>• Visual metrics and charts</li>
                <li>• Recruiter-ready format</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}