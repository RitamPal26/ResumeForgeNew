import React from 'react';
import { Star, GitFork, Users, TrendingUp, Award, Target } from 'lucide-react';
import type { DeveloperAnalysis } from '../../../types/github';

interface ImpactDashboardProps {
  analysis: DeveloperAnalysis;
}

export function ImpactDashboard({ analysis }: ImpactDashboardProps) {
  const { impactMetrics, collaborationMetrics, projectComplexity, developerClassification } = analysis;

  const metrics = [
    {
      label: 'Project Reach',
      value: impactMetrics.projectReach.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-blue-500',
      description: 'Total stars + forks + followers'
    },
    {
      label: 'Community Impact',
      value: `${Math.round(impactMetrics.communityImpact)}%`,
      icon: Users,
      color: 'bg-green-500',
      description: 'Community engagement score'
    },
    {
      label: 'Code Quality',
      value: `${Math.round(impactMetrics.codeQuality)}%`,
      icon: Award,
      color: 'bg-purple-500',
      description: 'Code quality indicators'
    },
    {
      label: 'Engagement Score',
      value: `${Math.round(collaborationMetrics.engagementScore)}%`,
      icon: Target,
      color: 'bg-orange-500',
      description: 'Overall engagement metrics'
    }
  ];

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Junior': return 'bg-blue-100 text-blue-800';
      case 'Mid': return 'bg-green-100 text-green-800';
      case 'Senior': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color}`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-500">{metric.label}</div>
              </div>
            </div>
            <p className="text-xs text-gray-600">{metric.description}</p>
          </div>
        ))}
      </div>

      {/* Developer Profile Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Developer Profile</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Primary Role</label>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {developerClassification.primaryRole}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Experience Level</label>
              <div className="mt-1">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getExperienceColor(developerClassification.experience)}`}>
                  {developerClassification.experience}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confidence Score</label>
              <div className="mt-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${developerClassification.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(developerClassification.confidence)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Top Skills</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {developerClassification.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Specializations</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {developerClassification.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="inline-flex px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Repository Stats</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Stars</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{impactMetrics.totalStars.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Forks</span>
              <div className="flex items-center space-x-1">
                <GitFork className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{impactMetrics.totalForks.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Stars/Repo</span>
              <span className="font-medium">{collaborationMetrics.averageStarsPerRepo.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Forks/Repo</span>
              <span className="font-medium">{collaborationMetrics.averageForksPerRepo.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Complexity Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Complexity Score</span>
              <span className="font-medium">{Math.round(projectComplexity.complexityScore)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Multi-language Projects</span>
              <span className="font-medium">{projectComplexity.multiLanguageProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Documentation Quality</span>
              <span className="font-medium">{Math.round(projectComplexity.documentationQuality)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Repository Size</span>
              <span className="font-medium">{Math.round(projectComplexity.averageRepoSize)} KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}