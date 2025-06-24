import React from 'react';
import { ExternalLink, GitCommit, Star, GitFork, Plus, AlertCircle, GitPullRequest } from 'lucide-react';

export function GitHubActivity({ activities }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    }
  };

  const getActivityIcon = (type, action) => {
    const iconClass = "w-4 h-4";
    
    switch (type) {
      case 'PushEvent':
        return <GitCommit className={iconClass} />;
      case 'CreateEvent':
        return <Plus className={iconClass} />;
      case 'ForkEvent':
        return <GitFork className={iconClass} />;
      case 'WatchEvent':
        return <Star className={iconClass} />;
      case 'IssuesEvent':
        return <AlertCircle className={iconClass} />;
      case 'PullRequestEvent':
        return <GitPullRequest className={iconClass} />;
      default:
        return <GitCommit className={iconClass} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'PushEvent':
        return 'text-green-600 bg-green-50';
      case 'CreateEvent':
        return 'text-blue-600 bg-blue-50';
      case 'ForkEvent':
        return 'text-purple-600 bg-purple-50';
      case 'WatchEvent':
        return 'text-yellow-600 bg-yellow-50';
      case 'IssuesEvent':
        return 'text-red-600 bg-red-50';
      case 'PullRequestEvent':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-secondary-600 bg-secondary-50';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors group"
        >
          {/* Activity Icon */}
          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type, activity.payload?.action)}
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-secondary-900">
                {activity.payload?.action || activity.type.replace('Event', '').toLowerCase()}
              </span>
              {activity.payload?.details && (
                <span className="text-sm text-secondary-600">
                  {activity.payload.details}
                </span>
              )}
              {activity.repo && (
                <a
                  href={activity.repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1 group-hover:underline"
                >
                  <span className="truncate">{activity.repo.name}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              )}
            </div>
            
            {activity.payload?.message && (
              <p className="text-sm text-secondary-700 truncate">
                {activity.payload.message}
              </p>
            )}
            
            {activity.payload?.branch && (
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-xs text-secondary-500">on</span>
                <span className="text-xs font-mono bg-secondary-100 text-secondary-700 px-1 rounded">
                  {activity.payload.branch}
                </span>
              </div>
            )}
            
            <div className="text-xs text-secondary-500 mt-1">
              {formatDate(activity.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}