// GitHub API service with real data fetching and authentication
import cacheService from "./cache";
import errorHandler from "./errorHandler";

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
      expires: Date.now() + this.ttl,
    });
  }
}

class GitHubService {
  constructor() {
    this.baseURL = "https://api.github.com";
    this.cache = new SimpleCache();
    // GitHub Personal Access Token - set this as an environment variable
    this.githubToken = import.meta.env.VITE_GITHUB_TOKEN || null;

    // Debug authentication status
    console.log("GitHub Token loaded:", this.githubToken ? "✅ Yes" : "❌ No");
    console.log(
      "Expected rate limit:",
      this.githubToken ? "5000/hour" : "60/hour"
    );
    if (this.githubToken) {
      console.log("Token preview:", `${this.githubToken.substring(0, 8)}...`);
    }

    this.apiConfig = {
      maxRetries: 3,
      cacheTimeout: 6 * 60 * 60 * 1000, // 6 hours
      rateLimit: {
        maxRequests: this.githubToken ? 5000 : 60,
        windowMs: 60 * 60 * 1000, // 1 hour
      },
    };
  }

  // Generic API request handler with authentication and retry-after handling
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    return await errorHandler.withRetry(
      async () => {
        try {
          const headers = {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "ResumeForge-App",
            ...options.headers,
          };

          // Add authentication if token is available
          if (this.githubToken) {
            headers["Authorization"] = `token ${this.githubToken}`;
          }

          const response = await fetch(url, {
            headers,
            ...options,
          });

          // Debug rate limiting info
          const rateLimit = response.headers.get("X-RateLimit-Limit");
          const remaining = response.headers.get("X-RateLimit-Remaining");
          console.log(`Rate Limit: ${remaining}/${rateLimit} remaining`);

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(
                "User not found. Please check the username and try again."
              );
            } else if (response.status === 403) {
              const rateLimitRemaining = response.headers.get(
                "X-RateLimit-Remaining"
              );
              const rateLimitReset = response.headers.get("X-RateLimit-Reset");
              const retryAfter = response.headers.get("Retry-After");

              if (rateLimitRemaining === "0" || retryAfter) {
                const waitTime = retryAfter
                  ? parseInt(retryAfter)
                  : Math.max(0, parseInt(rateLimitReset) * 1000 - Date.now());

                const waitMinutes = Math.ceil(waitTime / 60000);
                throw new Error(
                  `GitHub API rate limit exceeded. Please try again in ${waitMinutes} minute${
                    waitMinutes !== 1 ? "s" : ""
                  }.`
                );
              }

              throw new Error(
                "GitHub API access forbidden. Please check your authentication credentials."
              );
            } else if (response.status === 401) {
              throw new Error(
                "GitHub API authentication failed. Please check your credentials."
              );
            } else if (response.status >= 500) {
              throw new Error(
                "GitHub service is temporarily unavailable. Please try again later."
              );
            } else {
              throw new Error(
                `GitHub API error: ${response.status} - ${response.statusText}`
              );
            }
          }

          return await response.json();
        } catch (error) {
          if (error.name === "TypeError" && error.message.includes("fetch")) {
            throw new Error(
              "Network connection failed. Please check your internet connection and try again."
            );
          }
          throw error;
        }
      },
      { service: "github", method: endpoint }
    );
  }

  // Test authentication
  async testAuthentication() {
    try {
      const response = await this.makeRequest("/user");
      console.log("✅ Authentication successful - user:", response.login);
      return true;
    } catch (error) {
      console.log("❌ Authentication failed:", error.message);
      return false;
    }
  }

  // Fetch user profile
  async fetchUserProfile(username, forceRefresh = false) {
    if (!username || typeof username !== "string") {
      throw new Error("Please enter a valid GitHub username.");
    }

    const cached = forceRefresh
      ? null
      : await cacheService.get("github", "profile", username);
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate("github", "profile", username);
    }

    const data = await this.makeRequest(`/users/${username}`);

    const profile = {
      id: data.id,
      login: data.login,
      name: data.name || data.login,
      bio: data.bio || "",
      location: data.location || "",
      company: data.company || "",
      blog: data.blog || "",
      email: data.email || "",
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      followers: data.followers || 0,
      following: data.following || 0,
      public_repos: data.public_repos || 0,
      public_gists: data.public_gists || 0,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    await cacheService.set("github", "profile", username, profile);
    return profile;
  }

  // Fetch user repositories
  async fetchUserRepositories(username, limit = 100, forceRefresh = false) {
    if (!username) {
      throw new Error("Username is required to fetch repositories.");
    }

    const cached = forceRefresh
      ? null
      : await cacheService.get(
          "github",
          "repositories",
          `${username}_${limit}`
        );
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate(
        "github",
        "repositories",
        `${username}_${limit}`
      );
    }

    const data = await this.makeRequest(
      `/users/${username}/repos?sort=updated&per_page=${limit}`
    );

    const repositories = data.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description || "",
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      watchers_count: repo.watchers_count || 0,
      size: repo.size || 0,
      default_branch: repo.default_branch || "main",
      topics: repo.topics || [],
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      private: repo.private || false,
      fork: repo.fork || false,
      archived: repo.archived || false,
      open_issues_count: repo.open_issues_count || 0,
      has_issues: repo.has_issues || false,
      has_projects: repo.has_projects || false,
      has_wiki: repo.has_wiki || false,
      has_pages: repo.has_pages || false,
      has_downloads: repo.has_downloads || false,
      license: repo.license
        ? {
            key: repo.license.key,
            name: repo.license.name,
          }
        : null,
    }));

    await cacheService.set(
      "github",
      "repositories",
      `${username}_${limit}`,
      repositories
    );
    return repositories;
  }

  // Fetch repository languages with real API data
  async fetchRepositoryLanguages(owner, repo, forceRefresh = false) {
    if (!owner || !repo) {
      throw new Error(
        "Owner and repository name are required to fetch languages."
      );
    }

    const cacheKey = `${owner}_${repo}`;

    const cached = forceRefresh
      ? null
      : await cacheService.get("github", "repo_languages", cacheKey);
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate("github", "repo_languages", cacheKey);
    }

    try {
      const data = await this.makeRequest(`/repos/${owner}/${repo}/languages`);
      await cacheService.set("github", "repo_languages", cacheKey, data);
      return data;
    } catch (error) {
      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return {};
      }
      throw error;
    }
  }

  // FIXED: Fetch real user activity events (like GitHub profile heatmap)
  async fetchUserEvents(username, limit = 100, forceRefresh = false) {
    if (!username) {
      throw new Error("Username is required to fetch user events.");
    }

    const cached = forceRefresh
      ? null
      : await cacheService.get("github", "user_events", `${username}_${limit}`);
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate(
        "github",
        "user_events",
        `${username}_${limit}`
      );
    }

    try {
      const data = await this.makeRequest(
        `/users/${username}/events/public?per_page=${limit}`
      );

      // Process events into daily contribution counts
      const dailyContributions = {};
      const now = new Date();

      // Initialize last 365 days with 0
      for (let i = 0; i < 365; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateString = date.toISOString().split("T")[0];
        dailyContributions[dateString] = 0;
      }

      // Count contributions from events
      data.forEach((event) => {
        const eventDate = event.created_at.split("T")[0];
        if (dailyContributions.hasOwnProperty(eventDate)) {
          // Weight different event types
          let weight = 1;
          switch (event.type) {
            case "PushEvent":
              weight = event.payload?.commits?.length || 1;
              break;
            case "CreateEvent":
            case "IssuesEvent":
            case "PullRequestEvent":
              weight = 2;
              break;
            case "WatchEvent":
            case "ForkEvent":
              weight = 1;
              break;
            default:
              weight = 1;
          }
          dailyContributions[eventDate] += weight;
        }
      });

      await cacheService.set(
        "github",
        "user_events",
        `${username}_${limit}`,
        dailyContributions
      );
      return dailyContributions;
    } catch (error) {
      console.warn("Failed to fetch user events:", error.message);
      return {};
    }
  }

  // FIXED: Repository commit activity with better error handling
  async fetchRepoCommitActivity(owner, repo, forceRefresh = false) {
    if (!owner || !repo) {
      throw new Error(
        "Owner and repository name are required to fetch commit activity."
      );
    }

    const cacheKey = `${owner}_${repo}`;

    const cached = forceRefresh
      ? null
      : await cacheService.get("github", "repo_commits", cacheKey);
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate("github", "repo_commits", cacheKey);
    }

    try {
      const data = await this.makeRequest(
        `/repos/${owner}/${repo}/stats/commit_activity`
      );

      if (!data || data.length === 0) {
        return [];
      }

      await cacheService.set("github", "repo_commits", cacheKey, data);
      return data;
    } catch (error) {
      if (
        error.message.includes("not found") ||
        error.message.includes("404")
      ) {
        return [];
      }
      console.warn(
        `Failed to fetch commit activity for ${owner}/${repo}:`,
        error.message
      );
      return [];
    }
  }

  // FIXED: Calculate language statistics from REAL repository language data
  async fetchLanguageStats(username, limit = 50, forceRefresh = false) {
    if (!username) {
      throw new Error("Username is required to fetch language statistics.");
    }

    const cached = forceRefresh
      ? null
      : await cacheService.get("github", "languages", username);
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate("github", "languages", username);
    }

    const repositories = await this.fetchUserRepositories(
      username,
      limit,
      forceRefresh
    );
    const activeRepos = repositories.filter(
      (repo) => !repo.fork && !repo.archived
    );

    const languageBytes = new Map();
    let totalBytes = 0;

    // FIXED: Reduce API calls and increase delays
    const reposToAnalyze = activeRepos.slice(0, 10); // Reduced from 20 to 10
    console.log(
      `Analyzing languages for ${reposToAnalyze.length} repositories...`
    );

    for (const repo of reposToAnalyze) {
      try {
        const languages = await this.fetchRepositoryLanguages(
          repo.full_name.split("/")[0],
          repo.name,
          forceRefresh
        );

        // Weight languages by repository significance
        const significance = Math.max(
          1,
          repo.stargazers_count * 2 +
            repo.forks_count +
            (new Date() - new Date(repo.updated_at)) /
              (1000 * 60 * 60 * 24 * 365) <
            1
            ? 10
            : 0
        );

        Object.entries(languages).forEach(([language, bytes]) => {
          const weightedBytes = bytes * significance;
          languageBytes.set(
            language,
            (languageBytes.get(language) || 0) + weightedBytes
          );
          totalBytes += weightedBytes;
        });

        // FIXED: Increased delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 500)); // Increased from 100ms to 500ms
      } catch (error) {
        console.warn(
          `Failed to fetch languages for ${repo.full_name}:`,
          error.message
        );
      }
    }

    // Convert to percentage and sort
    const languageArray = Array.from(languageBytes.entries())
      .map(([language, bytes]) => ({
        language,
        size: Math.round(bytes),
        percentage:
          totalBytes > 0
            ? parseFloat(((bytes / totalBytes) * 100).toFixed(1))
            : 0,
        color: this.getLanguageColor(language),
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 8);

    await cacheService.set("github", "languages", username, languageArray);
    return languageArray;
  }

  // Fetch recent activity/events (legacy method)
  async fetchRecentActivity(username, limit = 10, forceRefresh = false) {
    if (!username) {
      throw new Error("Username is required to fetch recent activity.");
    }

    const cached = forceRefresh
      ? null
      : await cacheService.get("github", "activity", `${username}_${limit}`);
    if (cached) return cached;

    if (forceRefresh) {
      await cacheService.invalidate(
        "github",
        "activity",
        `${username}_${limit}`
      );
    }

    const data = await this.makeRequest(
      `/users/${username}/events/public?per_page=${limit}`
    );

    const activities = data
      .map((event) => ({
        id: event.id,
        type: event.type,
        repo: event.repo
          ? {
              name: event.repo.name,
              url: `https://github.com/${event.repo.name}`,
            }
          : null,
        created_at: event.created_at,
        payload: this.formatEventPayload(event),
      }))
      .filter((activity) => activity.payload);

    await cacheService.set(
      "github",
      "activity",
      `${username}_${limit}`,
      activities
    );
    return activities;
  }

  // Format event payload for display
  formatEventPayload(event) {
    switch (event.type) {
      case "PushEvent":
        const commits = event.payload.commits || [];
        return {
          action: "pushed",
          details: `${commits.length} commit${commits.length !== 1 ? "s" : ""}`,
          message: commits[0]?.message || "No commit message",
          branch: event.payload.ref?.replace("refs/heads/", "") || "main",
        };

      case "CreateEvent":
        return {
          action: "created",
          details: `${event.payload.ref_type} ${
            event.payload.ref || ""
          }`.trim(),
          message:
            event.payload.description || `Created ${event.payload.ref_type}`,
        };

      case "ForkEvent":
        return {
          action: "forked",
          details: "repository",
          message: `Forked to ${event.payload.forkee?.full_name || "unknown"}`,
        };

      case "WatchEvent":
        return {
          action: "starred",
          details: "repository",
          message: "Starred this repository",
        };

      case "IssuesEvent":
        return {
          action: `${event.payload.action} issue`,
          details: `#${event.payload.issue?.number || ""}`,
          message: event.payload.issue?.title || "No title",
        };

      case "PullRequestEvent":
        return {
          action: `${event.payload.action} pull request`,
          details: `#${event.payload.pull_request?.number || ""}`,
          message: event.payload.pull_request?.title || "No title",
        };

      default:
        return null;
    }
  }

  // Get language color (GitHub's color scheme)
  getLanguageColor(language) {
    const colors = {
      JavaScript: "#f1e05a",
      TypeScript: "#2b7489",
      Python: "#3572A5",
      Java: "#b07219",
      "C++": "#f34b7d",
      C: "#555555",
      "C#": "#239120",
      PHP: "#4F5D95",
      Ruby: "#701516",
      Go: "#00ADD8",
      Rust: "#dea584",
      Swift: "#ffac45",
      Kotlin: "#F18E33",
      Dart: "#00B4AB",
      HTML: "#e34c26",
      CSS: "#1572B6",
      SCSS: "#c6538c",
      Vue: "#2c3e50",
      React: "#61dafb",
      Angular: "#dd0031",
      Shell: "#89e051",
      PowerShell: "#012456",
      Dockerfile: "#384d54",
      YAML: "#cb171e",
      JSON: "#292929",
      Markdown: "#083fa1",
    };
    return colors[language] || "#586069";
  }
}

// Export singleton instance
export const githubService = new GitHubService();
export default githubService;
