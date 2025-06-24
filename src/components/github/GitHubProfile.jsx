import React from 'react';
import { ExternalLink, MapPin, Building, Users, Calendar, Mail, Globe } from 'lucide-react';

export function GitHubProfile({ profile }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Avatar and Basic Info */}
      <div className="flex-shrink-0">
        <img
          src={profile.avatar_url}
          alt={`${profile.name}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-primary-100 shadow-lg"
        />
      </div>

      {/* Profile Details */}
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-2xl font-bold text-secondary-900">{profile.name}</h3>
            <a
              href={profile.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 transition-colors"
              title="View on GitHub"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
          <p className="text-secondary-600 font-mono text-sm">@{profile.login}</p>
          {profile.bio && (
            <p className="text-secondary-700 mt-2">{profile.bio}</p>
          )}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {profile.location && (
            <div className="flex items-center space-x-2 text-secondary-600">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.company && (
            <div className="flex items-center space-x-2 text-secondary-600">
              <Building className="w-4 h-4" />
              <span>{profile.company}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center space-x-2 text-secondary-600">
              <Mail className="w-4 h-4" />
              <a 
                href={`mailto:${profile.email}`}
                className="hover:text-primary-600 transition-colors"
              >
                {profile.email}
              </a>
            </div>
          )}
          {profile.blog && (
            <div className="flex items-center space-x-2 text-secondary-600">
              <Globe className="w-4 h-4" />
              <a 
                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 transition-colors truncate"
              >
                {profile.blog}
              </a>
            </div>
          )}
          <div className="flex items-center space-x-2 text-secondary-600">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatDate(profile.created_at)}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 pt-4 border-t border-secondary-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-900">{profile.public_repos}</div>
            <div className="text-sm text-secondary-600">Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-900">{profile.followers}</div>
            <div className="text-sm text-secondary-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-900">{profile.following}</div>
            <div className="text-sm text-secondary-600">Following</div>
          </div>
          {profile.public_gists > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-900">{profile.public_gists}</div>
              <div className="text-sm text-secondary-600">Gists</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}