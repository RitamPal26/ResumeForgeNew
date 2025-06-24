import React from 'react';
import { ExternalLink, Star, GitFork, Calendar, Archive, Lock } from 'lucide-react';

export function GitHubRepositories({ repositories }) {
  // Sort repositories by stars and take top 6
  const topRepos = repositories
    .filter(repo => !repo.fork && !repo.archived) // Exclude forks and archived repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Python': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'C#': '#239120',
      'PHP': '#4F5D95',
      'Ruby': '#701516',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Dart': '#00B4AB',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'SCSS': '#c6538c',
      'Vue': '#2c3e50',
      'Shell': '#89e051'
    };
    return colors[language] || '#586069';
  };

  if (topRepos.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        No public repositories found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topRepos.map((repo) => (
        <div
          key={repo.id}
          className="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
        >
          {/* Repository Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-secondary-900 truncate group-hover:text-primary-600 transition-colors">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1"
                >
                  <span className="truncate">{repo.name}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                {repo.private && (
                  <Lock className="w-3 h-3 text-secondary-400" />
                )}
                {repo.archived && (
                  <Archive className="w-3 h-3 text-secondary-400" />
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
              {repo.description}
            </p>
          )}

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {repo.topics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 text-xs bg-primary-50 text-primary-700 rounded-full"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 3 && (
                <span className="px-2 py-1 text-xs bg-secondary-100 text-secondary-600 rounded-full">
                  +{repo.topics.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Repository Stats */}
          <div className="flex items-center justify-between text-sm text-secondary-600">
            <div className="flex items-center space-x-3">
              {repo.language && (
                <div className="flex items-center space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getLanguageColor(repo.language) }}
                  />
                  <span>{repo.language}</span>
                </div>
              )}
              {repo.stargazers_count > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{repo.stargazers_count}</span>
                </div>
              )}
              {repo.forks_count > 0 && (
                <div className="flex items-center space-x-1">
                  <GitFork className="w-3 h-3" />
                  <span>{repo.forks_count}</span>
                </div>
              )}
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-center space-x-1 text-xs text-secondary-500 mt-2">
            <Calendar className="w-3 h-3" />
            <span>Updated {formatDate(repo.updated_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}