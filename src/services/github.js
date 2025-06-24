// GitHub API service with in-memory caching
import cacheService from './cache';
import errorHandler from './errorHandler';

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 6 * 60 * 60 * 1000; // 6 hours
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.ttl
    });
  }
}

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.cache = new SimpleCache(); // Keep for backward compatibility
    this.apiConfig = {
      maxRetries: 3,
      cacheTimeout: 6 * 60 * 60 * 1000, // 6 hours
      rateLimit: {
        maxRequests: 5000,
        windowMs: 60 * 60 * 1000 // 1 hour
      }
    };
  }

  // Generic API request handler
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    return await errorHandler.withRetry(async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'ResumeForge-App',
            ...options.headers
          },
          ...options
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found. Please check the username and try again.');
          } else if (response.status === 403) {
            const resetTime = response.headers.get('X-RateLimit-Reset');
            const resetDate = new Date(resetTime * 1000);
            throw new Error(`GitHub API rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}.`);
          } else if (response.status === 401) {
            throw new Error('GitHub API authentication failed. Please check your credentials.');
          } else if (response.status >= 500) {
            throw new Error('GitHub service is temporarily unavailable. Please try again later.');
          } else {
            throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
          }
        }

        return await response.json();
      } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new Error('Network connection failed. Please check your internet connection and try again.');
        }
        throw error;
      }
    }, { service: 'github', method: endpoint });
  }

  // Fetch user profile
  async fetchUserProfile(username, forceRefresh = false) {
    if (!username || typeof username !== 'string') {
      throw new Error('Please enter a valid GitHub username.');
    }

    // Try cache service first
    const cached = forceRefresh ? null : await cacheService.get('github', 'profile', username);
    if (cached) return cached;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('github', 'profile', username);
    }
    

    const data = await this.makeRequest(`/users/${username}`);
    
    const profile = {
      id: data.id,
      login: data.login,
      name: data.name || data.login,
      bio: data.bio || '',
      location: data.location || '',
      company: data.company || '',
      blog: data.blog || '',
      email: data.email || '',
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      followers: data.followers || 0,
      following: data.following || 0,
      public_repos: data.public_repos || 0,
      public_gists: data.public_gists || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    // Cache the result
    await cacheService.set('github', 'profile', username, profile);
    return profile;
  }

  // Fetch user repositories
  async fetchUserRepositories(username, limit = 100, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch repositories.');
    }

    // Try cache service first
    const cached = forceRefresh ? null : await cacheService.get('github', 'repositories', `${username}_${limit}`);
    if (cached) return cached;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('github', 'repositories', `${username}_${limit}`);
    }
    

    const data = await this.makeRequest(`/users/${username}/repos?sort=updated&per_page=${limit}`);
    
    const repositories = data.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || '',
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      watchers_count: repo.watchers_count || 0,
      size: repo.size || 0,
      default_branch: repo.default_branch || 'main',
      topics: repo.topics || [],
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      private: repo.private || false,
      fork: repo.fork || false,
      archived: repo.archived || false
    }));

    // Cache the result
    await cacheService.set('github', 'repositories', `${username}_${limit}`, repositories);
    return repositories;
  }

  // Calculate language statistics from repositories
  async fetchLanguageStats(username, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch language statistics.');
    }

    // Try cache service first
    const cached = forceRefresh ? null : await cacheService.get('github', 'languages', username);
    if (cached) return cached;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('github', 'languages', username);
    }
    

    const repositories = await this.fetchUserRepositories(username, 100, forceRefresh);
    
    const languageStats = {};
    let totalSize = 0;

    // Count languages from repositories
    repositories.forEach(repo => {
      if (repo.language && !repo.fork && !repo.archived) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + (repo.size || 1);
        totalSize += (repo.size || 1);
      }
    });

    // Convert to percentage and sort
    const languageArray = Object.entries(languageStats)
      .map(([language, size]) => ({
        language,
        size,
        percentage: totalSize > 0 ? ((size / totalSize) * 100).toFixed(1) : 0,
        color: this.getLanguageColor(language)
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 5); // Top 5 languages

    // Cache the result
    await cacheService.set('github', 'languages', username, languageArray);
    return languageArray;
  }

  // Fetch recent activity/events
  async fetchRecentActivity(username, limit = 10, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch recent activity.');
    }

    // Try cache service first
    const cached = forceRefresh ? null : await cacheService.get('github', 'activity', `${username}_${limit}`);
    if (cached) return cached;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('github', 'activity', `${username}_${limit}`);
    }
    

    const data = await this.makeRequest(`/users/${username}/events/public?per_page=${limit}`);
    
    const activities = data.map(event => ({
      id: event.id,
      type: event.type,
      repo: event.repo ? {
        name: event.repo.name,
        url: `https://github.com/${event.repo.name}`
      } : null,
      created_at: event.created_at,
      payload: this.formatEventPayload(event)
    })).filter(activity => activity.payload); // Filter out unsupported event types

    // Cache the result
    await cacheService.set('github', 'activity', `${username}_${limit}`, activities);
    return activities;
  }

  // Format event payload for display
  formatEventPayload(event) {
    switch (event.type) {
      case 'PushEvent':
        const commits = event.payload.commits || [];
        return {
          action: 'pushed',
          details: `${commits.length} commit${commits.length !== 1 ? 's' : ''}`,
          message: commits[0]?.message || 'No commit message',
          branch: event.payload.ref?.replace('refs/heads/', '') || 'main'
        };
      
      case 'CreateEvent':
        return {
          action: 'created',
          details: `${event.payload.ref_type} ${event.payload.ref || ''}`.trim(),
          message: event.payload.description || `Created ${event.payload.ref_type}`
        };
      
      case 'ForkEvent':
        return {
          action: 'forked',
          details: 'repository',
          message: `Forked to ${event.payload.forkee?.full_name || 'unknown'}`
        };
      
      case 'WatchEvent':
        return {
          action: 'starred',
          details: 'repository',
          message: 'Starred this repository'
        };
      
      case 'IssuesEvent':
        return {
          action: `${event.payload.action} issue`,
          details: `#${event.payload.issue?.number || ''}`,
          message: event.payload.issue?.title || 'No title'
        };
      
      case 'PullRequestEvent':
        return {
          action: `${event.payload.action} pull request`,
          details: `#${event.payload.pull_request?.number || ''}`,
          message: event.payload.pull_request?.title || 'No title'
        };
      
      default:
        return null; // Unsupported event type
    }
  }

  // Get language color (GitHub's color scheme)
  getLanguageColor(language) {
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
      'React': '#61dafb',
      'Angular': '#dd0031',
      'Shell': '#89e051',
      'PowerShell': '#012456',
      'Dockerfile': '#384d54',
      'YAML': '#cb171e',
      'JSON': '#292929',
      'Markdown': '#083fa1'
    };
    return colors[language] || '#586069';
  }
}

// Export singleton instance
export const githubService = new GitHubService();
export default githubService;