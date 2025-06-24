// LeetCode API service with in-memory caching
import { supabase } from './supabase';
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

class LeetCodeService {
  constructor() {
    // Use the direct LeetCode GraphQL endpoint instead of Supabase Edge Function
    this.baseURL = 'https://gtaswvttgidaybcznflp.supabase.co/functions/v1/leetcode-proxy';
    this.cache = new SimpleCache();
  }

  // Generic GraphQL request handler
  async makeRequest(query, variables = {}, options = {}) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ResumeForge-App',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found. Please check the username and try again.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('LeetCode service is temporarily unavailable. Please try again later.');
        } else {
          throw new Error(`LeetCode API error: ${response.status}`);
        }
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL query failed');
      }

      return data.data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  // Fetch user profile data
  async fetchUserProfile(username, forceRefresh = false) {
    if (!username || typeof username !== 'string') {
      throw new Error('Please enter a valid LeetCode username.');
    }

    const cacheKey = `leetcode_profile_${username}`;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('leetcode', 'profile', username);
    } else {
      // Try cache service first
      const cachedService = await cacheService.get('leetcode', 'profile', username);
      if (cachedService) return cachedService;
      
      // Then try in-memory cache
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            aboutMe
            userAvatar
            location
            websites
            skillTags
            company
            school
            ranking
          }
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          badges {
            id
            displayName
            icon
            creationDate
          }
        }
      }
    `;

    const data = await errorHandler.withRetry(() => this.makeRequest(query, { username }), { service: 'leetcode', method: 'profile' });
    
    if (!data.matchedUser) {
      throw new Error('User not found. Please check the username and try again.');
    }

    const profile = {
      username: data.matchedUser.username,
      realName: data.matchedUser.profile?.realName || '',
      aboutMe: data.matchedUser.profile?.aboutMe || '',
      avatar: data.matchedUser.profile?.userAvatar || '',
      location: data.matchedUser.profile?.location || '',
      websites: data.matchedUser.profile?.websites || [],
      skillTags: data.matchedUser.profile?.skillTags || [],
      company: data.matchedUser.profile?.company || '',
      school: data.matchedUser.profile?.school || '',
      ranking: data.matchedUser.profile?.ranking || 0,
      submitStats: data.matchedUser.submitStats || {},
      badges: data.matchedUser.badges || []
    };

    this.cache.set(cacheKey, profile);
    await cacheService.set('leetcode', 'profile', username, profile);
    return profile;
  }

  // Fetch contest data
  async fetchContestData(username, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch contest data.');
    }

    const cacheKey = `leetcode_contest_${username}`;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('leetcode', 'contest', username);
    } else {
      // Try cache service first
      const cachedService = await cacheService.get('leetcode', 'contest', username);
      if (cachedService) return cachedService;
      
      // Then try in-memory cache
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const query = `
      query getUserContestRanking($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          trendDirection
          problemsSolved
          totalProblems
          finishTimeInSeconds
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
    `;

    const data = await errorHandler.withRetry(() => this.makeRequest(query, { username }), { service: 'leetcode', method: 'contest' });
    
    const contestData = {
      ranking: data.userContestRanking || {},
      history: data.userContestRankingHistory || []
    };

    this.cache.set(cacheKey, contestData);
    await cacheService.set('leetcode', 'contest', username, contestData);
    return contestData;
  }

  // Fetch recent submissions
  async fetchRecentSubmissions(username, limit = 20, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch submissions.');
    }

    const cacheKey = `leetcode_submissions_${username}_${limit}`;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('leetcode', 'submissions', `${username}_${limit}`);
    } else {
      // Try cache service first
      const cachedService = await cacheService.get('leetcode', 'submissions', `${username}_${limit}`);
      if (cachedService) return cachedService;
      
      // Then try in-memory cache
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const query = `
      query getRecentSubmissions($username: String!, $limit: Int) {
        recentSubmissionList(username: $username, limit: $limit) {
          title
          titleSlug
          timestamp
          statusDisplay
          lang
          runtime
          url
          isPending
          memory
          hasNotes
          notes
        }
      }
    `;

    const data = await errorHandler.withRetry(() => this.makeRequest(query, { username, limit }), { service: 'leetcode', method: 'submissions' });
    
    const submissions = (data.recentSubmissionList || []).map(submission => ({
      title: submission.title,
      titleSlug: submission.titleSlug,
      timestamp: submission.timestamp,
      status: submission.statusDisplay,
      language: submission.lang,
      runtime: submission.runtime,
      memory: submission.memory,
      url: submission.url,
      isPending: submission.isPending,
      hasNotes: submission.hasNotes,
      notes: submission.notes
    }));

    this.cache.set(cacheKey, submissions);
    await cacheService.set('leetcode', 'submissions', `${username}_${limit}`, submissions);
    return submissions;
  }

  // Fetch problem solving patterns
  async fetchProblemStats(username, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch problem statistics.');
    }

    const cacheKey = `leetcode_problemstats_${username}`;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('leetcode', 'problemstats', username);
    } else {
      // Try cache service first
      const cachedService = await cacheService.get('leetcode', 'problemstats', username);
      if (cachedService) return cachedService;
      
      // Then try in-memory cache
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const query = `
      query getUserProblemsSolved($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          problemsSolvedBeatsStats {
            difficulty
            percentage
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          tagProblemCounts {
            advanced {
              tagName
              tagSlug
              problemsSolved
            }
            intermediate {
              tagName
              tagSlug
              problemsSolved
            }
            fundamental {
              tagName
              tagSlug
              problemsSolved
            }
          }
        }
      }
    `;

    const data = await errorHandler.withRetry(() => this.makeRequest(query, { username }), { service: 'leetcode', method: 'problemstats' });
    
    const stats = {
      totalQuestions: data.allQuestionsCount || [],
      solvedStats: data.matchedUser?.submitStatsGlobal?.acSubmissionNum || [],
      beatsStats: data.matchedUser?.problemsSolvedBeatsStats || [],
      tagStats: data.matchedUser?.tagProblemCounts || {}
    };

    this.cache.set(cacheKey, stats);
    await cacheService.set('leetcode', 'problemstats', username, stats);
    return stats;
  }

  // Calculate language distribution from submissions
  async fetchLanguageStats(username, forceRefresh = false) {
    if (!username) {
      throw new Error('Username is required to fetch language statistics.');
    }

    const cacheKey = `leetcode_languages_${username}`;
    
    // If forcing refresh, invalidate the cache
    if (forceRefresh) {
      await cacheService.invalidate('leetcode', 'languages', username);
    } else {
      // Try cache service first
      const cachedService = await cacheService.get('leetcode', 'languages', username);
      if (cachedService) return cachedService;
      
      // Then try in-memory cache
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const submissions = await this.fetchRecentSubmissions(username, 100, forceRefresh);
    
    const languageCount = {};
    let totalSubmissions = 0;

    submissions.forEach(submission => {
      if (submission.language && submission.status === 'Accepted') {
        languageCount[submission.language] = (languageCount[submission.language] || 0) + 1;
        totalSubmissions++;
      }
    });

    const languageStats = Object.entries(languageCount)
      .map(([language, count]) => ({
        language,
        count,
        percentage: totalSubmissions > 0 ? ((count / totalSubmissions) * 100).toFixed(1) : 0,
        color: this.getLanguageColor(language)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    this.cache.set(cacheKey, languageStats);
    await cacheService.set('leetcode', 'languages', username, languageStats);
    return languageStats;
  }

  // Get language color mapping
  getLanguageColor(language) {
    const colors = {
      'Python': '#3572A5',
      'Python3': '#3572A5',
      'Java': '#b07219',
      'C++': '#f34b7d',
      'C': '#555555',
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Go': '#00ADD8',
      'Rust': '#dea584',
      'Swift': '#ffac45',
      'Kotlin': '#F18E33',
      'Scala': '#c22d40',
      'Ruby': '#701516',
      'PHP': '#4F5D95',
      'C#': '#239120',
      'Dart': '#00B4AB',
      'Elixir': '#6e4a7e',
      'Erlang': '#B83998',
      'Racket': '#3c5caa',
      'MySQL': '#4479A1',
      'MS SQL Server': '#CC2927'
    };
    return colors[language] || '#586069';
  }
}

// Export singleton instance
export const leetcodeService = new LeetCodeService();
export default leetcodeService;