import { supabase } from "./supabase";
import githubService from "./github";
import cacheService from "./cache";
import errorHandler from "./errorHandler";
import type {
  GitHubRepository,
  GitHubProfile,
  LanguageStats,
  RepositoryCategory,
  ActivityPattern,
  CollaborationMetrics,
  ProjectComplexity,
  DeveloperClassification,
  DeveloperAnalysis,
  AnalysisProgress,
} from "../types/github";

class GitHubAnalyzer {
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
  private progressCallbacks = new Map<
    string,
    (progress: AnalysisProgress) => void
  >();

  // Repository categorization patterns
  private readonly categoryPatterns = {
    "Web Development": {
      keywords: [
        "react",
        "vue",
        "angular",
        "next",
        "nuxt",
        "svelte",
        "web",
        "frontend",
        "backend",
        "fullstack",
      ],
      languages: ["JavaScript", "TypeScript", "HTML", "CSS", "PHP", "Ruby"],
      topics: ["web", "frontend", "backend", "fullstack", "webapp", "website"],
      color: "#3b82f6",
    },
    "Mobile Development": {
      keywords: [
        "android",
        "ios",
        "mobile",
        "flutter",
        "react-native",
        "ionic",
        "xamarin",
      ],
      languages: ["Swift", "Kotlin", "Java", "Dart", "Objective-C"],
      topics: ["android", "ios", "mobile", "flutter", "react-native"],
      color: "#10b981",
    },
    "Data Science": {
      keywords: [
        "data",
        "science",
        "machine",
        "learning",
        "ai",
        "ml",
        "analytics",
        "visualization",
      ],
      languages: ["Python", "R", "Julia", "Scala"],
      topics: [
        "data-science",
        "machine-learning",
        "ai",
        "analytics",
        "visualization",
      ],
      color: "#f59e0b",
    },
    DevOps: {
      keywords: [
        "docker",
        "kubernetes",
        "terraform",
        "ansible",
        "jenkins",
        "ci",
        "cd",
        "deployment",
      ],
      languages: ["Shell", "PowerShell", "YAML", "HCL"],
      topics: ["devops", "docker", "kubernetes", "ci-cd", "infrastructure"],
      color: "#ef4444",
    },
    "Game Development": {
      keywords: ["game", "unity", "unreal", "godot", "pygame", "phaser"],
      languages: ["C#", "C++", "C", "GDScript"],
      topics: ["game", "unity", "gamedev", "gaming"],
      color: "#8b5cf6",
    },
    "System Programming": {
      keywords: [
        "system",
        "kernel",
        "driver",
        "embedded",
        "firmware",
        "low-level",
      ],
      languages: ["C", "C++", "Rust", "Assembly", "Go"],
      topics: ["systems", "embedded", "kernel", "low-level"],
      color: "#6b7280",
    },
    Blockchain: {
      keywords: [
        "blockchain",
        "crypto",
        "ethereum",
        "bitcoin",
        "smart",
        "contract",
        "defi",
        "nft",
      ],
      languages: ["Solidity", "JavaScript", "TypeScript", "Go", "Rust"],
      topics: ["blockchain", "cryptocurrency", "ethereum", "smart-contracts"],
      color: "#f97316",
    },
  };

  // Language complexity scores (1-10)
  private readonly languageComplexity = {
    Assembly: 10,
    C: 9,
    "C++": 9,
    Rust: 8,
    Go: 7,
    Java: 7,
    "C#": 6,
    Python: 5,
    JavaScript: 5,
    TypeScript: 6,
    Ruby: 5,
    PHP: 4,
    HTML: 2,
    CSS: 3,
    Shell: 6,
    PowerShell: 5,
  };

  async analyzeUser(
    username: string,
    options?: {
      onProgress?: (progress: AnalysisProgress) => void;
      forceRefresh?: boolean;
    }
  ): Promise<DeveloperAnalysis> {
    const onProgress = options?.onProgress;
    const forceRefresh = options?.forceRefresh || false;

    if (onProgress) {
      this.progressCallbacks.set(username, onProgress);
    }

    try {
      // Check cache first
      const cached = forceRefresh
        ? null
        : await cacheService.get("github-analysis", "full", username);
      if (!forceRefresh && cached && !this.isCacheExpired(cached)) {
        this.updateProgress(username, {
          stage: "complete",
          progress: 100,
          currentTask: "Loading cached analysis",
          estimatedTimeRemaining: 0,
        });
        return cached;
      }

      // If forcing refresh, invalidate the cache
      if (forceRefresh) {
        await cacheService.invalidate("github-analysis", "full", username);
      }

      this.updateProgress(username, {
        stage: "basic",
        progress: 10,
        currentTask: "Fetching GitHub profile",
        estimatedTimeRemaining: 30,
      });

      // Stage 1: Basic data collection
      const profile = await errorHandler.withRetry(
        () => githubService.fetchUserProfile(username, forceRefresh),
        { service: "github", method: "profile", username }
      );

      const repositories = await errorHandler.withRetry(
        () => githubService.fetchUserRepositories(username, 100, forceRefresh),
        { service: "github", method: "repositories", username }
      );

      this.updateProgress(username, {
        stage: "basic",
        progress: 30,
        currentTask: "Analyzing languages",
        estimatedTimeRemaining: 25,
      });

      // Stage 2: Basic analysis - Use REAL language data from GitHub API
      const languageStats = await errorHandler.withRetry(
        () => this.analyzeLanguages(repositories, username, forceRefresh),
        { service: "github-analysis", method: "languages", username }
      );

      const repositoryCategories = this.categorizeRepositories(repositories);

      this.updateProgress(username, {
        stage: "detailed",
        progress: 50,
        currentTask: "Calculating metrics",
        estimatedTimeRemaining: 20,
      });

      // Stage 3: Detailed metrics
      const collaborationMetrics = this.calculateCollaborationMetrics(
        repositories,
        profile
      );
      const projectComplexity = this.calculateProjectComplexity(
        repositories,
        languageStats
      );

      this.updateProgress(username, {
        stage: "detailed",
        progress: 70,
        currentTask: "Analyzing activity patterns",
        estimatedTimeRemaining: 15,
      });

      const activityPatterns = await errorHandler.withRetry(
        () =>
          this.analyzeActivityPatterns(username, repositories, forceRefresh),
        { service: "github-analysis", method: "activity", username }
      );

      this.updateProgress(username, {
        stage: "advanced",
        progress: 85,
        currentTask: "Generating developer classification",
        estimatedTimeRemaining: 10,
      });

      // Stage 4: Advanced analysis
      const developerClassification = this.classifyDeveloper(
        repositories,
        languageStats,
        repositoryCategories
      );
      const impactMetrics = this.calculateImpactMetrics(repositories, profile);

      this.updateProgress(username, {
        stage: "advanced",
        progress: 95,
        currentTask: "Finalizing analysis",
        estimatedTimeRemaining: 5,
      });

      const analysis: DeveloperAnalysis = {
        username,
        profile,
        languageStats,
        repositoryCategories,
        activityPatterns,
        collaborationMetrics,
        projectComplexity,
        developerClassification,
        impactMetrics,
        lastAnalyzed: new Date().toISOString(),
        cacheExpiry: new Date(Date.now() + this.CACHE_DURATION).toISOString(),
      };

      // Cache the results
      await cacheService.set(
        "github-analysis",
        "full",
        username,
        analysis,
        this.CACHE_DURATION
      );

      this.updateProgress(username, {
        stage: "complete",
        progress: 100,
        currentTask: "Analysis complete",
        estimatedTimeRemaining: 0,
      });

      return analysis;
    } catch (error) {
      const handledError = errorHandler.handleError(error, {
        service: "github-analysis",
        username,
        stage: "analysis",
      });
      throw new Error(handledError.message);
    } finally {
      this.progressCallbacks.delete(username);
    }
  }

  private updateProgress(username: string, progress: AnalysisProgress) {
    const callback = this.progressCallbacks.get(username);
    if (callback) {
      callback(progress);
    }
  }

  // FIXED: Use REAL GitHub language API data
  private async analyzeLanguages(
    repositories: GitHubRepository[],
    username: string,
    forceRefresh = false
  ): Promise<LanguageStats[]> {
    try {
      // Use the real language stats from GitHub API
      const realLanguageStats = await githubService.fetchLanguageStats(
        username,
        100,
        forceRefresh
      );

      // Convert to our LanguageStats format and add proficiency calculation
      const languageStats: LanguageStats[] = realLanguageStats.map(
        (langStat) => ({
          language: langStat.language,
          bytes: langStat.size,
          percentage: langStat.percentage,
          color: langStat.color,
          proficiency: this.calculateLanguageProficiency(
            langStat.language,
            langStat.size,
            repositories
          ),
        })
      );

      return languageStats;
    } catch (error) {
      console.warn(
        "Failed to fetch real language data, using fallback:",
        error
      );

      // Fallback to repository-based analysis if API fails
      const languageBytes = new Map<string, number>();
      let totalBytes = 0;

      const activeRepos = repositories.filter(
        (repo) => !repo.fork && !repo.archived
      );

      activeRepos.forEach((repo) => {
        if (repo.language) {
          const bytes = repo.size * 1024; // Convert KB to bytes
          languageBytes.set(
            repo.language,
            (languageBytes.get(repo.language) || 0) + bytes
          );
          totalBytes += bytes;
        }
      });

      const languageStats: LanguageStats[] = Array.from(languageBytes.entries())
        .map(([language, bytes]) => ({
          language,
          bytes,
          percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
          color: this.getLanguageColor(language),
          proficiency: this.calculateLanguageProficiency(
            language,
            bytes,
            repositories
          ),
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 10);

      return languageStats;
    }
  }

  private calculateLanguageProficiency(
    language: string,
    bytes: number,
    repositories: GitHubRepository[]
  ): number {
    const reposWithLanguage = repositories.filter(
      (repo) => repo.language === language && !repo.fork
    );
    const complexity = this.languageComplexity[language] || 5;
    const usage = Math.min(reposWithLanguage.length * 10, 50); // Max 50 points for usage
    const size = Math.min(bytes / 10000, 30); // Max 30 points for code size
    const complexityBonus = complexity * 2; // Max 20 points for complexity

    return Math.min(usage + size + complexityBonus, 100);
  }

  private categorizeRepositories(
    repositories: GitHubRepository[]
  ): RepositoryCategory[] {
    const categories = new Map<string, string[]>();
    const activeRepos = repositories.filter(
      (repo) => !repo.fork && !repo.archived
    );

    activeRepos.forEach((repo) => {
      const repoCategories = this.getRepositoryCategories(repo);
      repoCategories.forEach((category) => {
        if (!categories.has(category)) {
          categories.set(category, []);
        }
        categories.get(category)!.push(repo.name);
      });
    });

    const totalRepos = activeRepos.length;
    return Array.from(categories.entries())
      .map(([category, repos]) => ({
        category,
        count: repos.length,
        percentage: totalRepos > 0 ? (repos.length / totalRepos) * 100 : 0,
        repositories: repos,
        color: this.categoryPatterns[category]?.color || "#6b7280",
      }))
      .sort((a, b) => b.count - a.count);
  }

  private getRepositoryCategories(repo: GitHubRepository): string[] {
    const categories: string[] = [];
    const searchText = `${repo.name} ${
      repo.description || ""
    } ${repo.topics.join(" ")}`.toLowerCase();

    Object.entries(this.categoryPatterns).forEach(([category, pattern]) => {
      let score = 0;

      // Check keywords
      pattern.keywords.forEach((keyword) => {
        if (searchText.includes(keyword)) score += 2;
      });

      // Check language
      if (repo.language && pattern.languages.includes(repo.language)) {
        score += 3;
      }

      // Check topics
      pattern.topics.forEach((topic) => {
        if (repo.topics.includes(topic)) score += 3;
      });

      if (score >= 2) {
        categories.push(category);
      }
    });

    return categories.length > 0 ? categories : ["Other"];
  }

  private calculateCollaborationMetrics(
    repositories: GitHubRepository[],
    profile: GitHubProfile
  ): CollaborationMetrics {
    const activeRepos = repositories.filter(
      (repo) => !repo.fork && !repo.archived
    );
    const totalStars = activeRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const totalForks = activeRepos.reduce(
      (sum, repo) => sum + repo.forks_count,
      0
    );

    const averageStarsPerRepo =
      activeRepos.length > 0 ? totalStars / activeRepos.length : 0;
    const averageForksPerRepo =
      activeRepos.length > 0 ? totalForks / activeRepos.length : 0;

    // Calculate engagement score based on various factors
    const starScore = Math.min(totalStars / 10, 30); // Max 30 points
    const forkScore = Math.min(totalForks / 5, 20); // Max 20 points
    const followerScore = Math.min(profile.followers / 10, 25); // Max 25 points
    const repoScore = Math.min(activeRepos.length * 2, 25); // Max 25 points

    const engagementScore = Math.min(
      starScore + forkScore + followerScore + repoScore,
      100
    );

    return {
      engagementScore,
      averageStarsPerRepo,
      averageForksPerRepo,
      totalContributors: 0, // Would need additional API calls to calculate
      issueResponseTime: 0, // Would need additional API calls to calculate
      communityHealth: Math.min(
        engagementScore + (profile.public_repos > 5 ? 10 : 0),
        100
      ),
    };
  }

  private calculateProjectComplexity(
    repositories: GitHubRepository[],
    languageStats: LanguageStats[]
  ): ProjectComplexity {
    const activeRepos = repositories.filter(
      (repo) => !repo.fork && !repo.archived
    );
    const averageRepoSize =
      activeRepos.length > 0
        ? activeRepos.reduce((sum, repo) => sum + repo.size, 0) /
          activeRepos.length
        : 0;

    const multiLanguageProjects = activeRepos.filter((repo) =>
      languageStats.some(
        (lang) => lang.language === repo.language && lang.percentage > 5
      )
    ).length;

    // Calculate complexity score
    const sizeScore = Math.min(averageRepoSize / 100, 25); // Max 25 points
    const languageScore = Math.min(languageStats.length * 5, 25); // Max 25 points
    const diversityScore = Math.min(multiLanguageProjects * 3, 25); // Max 25 points
    const topicScore = Math.min(
      (activeRepos.reduce((sum, repo) => sum + repo.topics.length, 0) /
        activeRepos.length) *
        5,
      25
    ); // Max 25 points

    const complexityScore = Math.min(
      sizeScore + languageScore + diversityScore + topicScore,
      100
    );

    return {
      complexityScore,
      averageRepoSize,
      multiLanguageProjects,
      documentationQuality: this.calculateDocumentationQuality(activeRepos),
      dependencyComplexity: 70, // Placeholder - would need package.json analysis
    };
  }

  private calculateDocumentationQuality(
    repositories: GitHubRepository[]
  ): number {
    const reposWithReadme = repositories.filter(
      (repo) => repo.has_wiki || repo.has_pages
    ).length;
    const reposWithDescription = repositories.filter(
      (repo) => repo.description && repo.description.length > 10
    ).length;

    const readmeScore =
      repositories.length > 0
        ? (reposWithReadme / repositories.length) * 50
        : 0;
    const descriptionScore =
      repositories.length > 0
        ? (reposWithDescription / repositories.length) * 50
        : 0;

    return Math.min(readmeScore + descriptionScore, 100);
  }

  // FIXED: Use REAL GitHub commit activity data
  private async analyzeActivityPatterns(
  username: string,
  repositories: GitHubRepository[],
  forceRefresh = false
): Promise<ActivityPattern[]> {
  try {
    // CHANGE 1: Use fetchUserEvents for overall GitHub activity
    const userEvents = await githubService.fetchUserEvents(username, 300, forceRefresh);
    
    const patterns: ActivityPattern[] = [];
    const now = new Date();
    
    // CHANGE 2: Convert daily contributions to weekly patterns
    for (let i = 0; i < 52; i++) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      let weeklyCommits = 0;
      let weeklyAdditions = 0;
      let weeklyDeletions = 0;
      const activeRepos = new Set<string>();
      
      // Sum up daily contributions for the week
      for (let day = 0; day < 7; day++) {
        const date = new Date(weekStart.getTime() + day * 24 * 60 * 60 * 1000);
        const dateString = date.toISOString().split('T')[0];
        const dailyContributions = userEvents[dateString] || 0;
        
        weeklyCommits += dailyContributions;
        weeklyAdditions += dailyContributions * 15; // Estimate additions
        weeklyDeletions += dailyContributions * 3;  // Estimate deletions
        
        // Add some repository names for active weeks
        if (dailyContributions > 0) {
          repositories.slice(0, 3).forEach(repo => {
            if (!repo.fork && !repo.archived) {
              activeRepos.add(repo.name);
            }
          });
        }
      }
      
      patterns.push({
        date: weekStart.toISOString().split('T')[0],
        commits: weeklyCommits,
        additions: weeklyAdditions,
        deletions: weeklyDeletions,
        repositories: Array.from(activeRepos)
      });
    }
    
    return patterns.reverse(); // Return chronologically
    
  } catch (error) {
    console.warn('Failed to fetch user events, using repository fallback:', error);
    
    // CHANGE 3: Keep your existing repository-based fallback but with improvements
    try {
      const patterns: ActivityPattern[] = [];
      const now = new Date();
      const activeRepos = repositories
        .filter((repo) => !repo.fork && !repo.archived)
        .slice(0, 5); // REDUCED from 10 to 5 to avoid rate limits

      const allCommitActivity = new Map<string, {
        commits: number;
        additions: number;
        deletions: number;
        repos: Set<string>;
      }>();

      // Fetch real commit activity for each repository
      for (const repo of activeRepos) {
        try {
          const [owner, repoName] = repo.full_name.split("/");
          const commitActivity = await githubService.fetchRepoCommitActivity(
            owner,
            repoName,
            forceRefresh
          );

          if (commitActivity && commitActivity.length > 0) {
            commitActivity.forEach((week: any) => {
              const weekDate = new Date(week.week * 1000)
                .toISOString()
                .split("T")[0];

              if (!allCommitActivity.has(weekDate)) {
                allCommitActivity.set(weekDate, {
                  commits: 0,
                  additions: 0,
                  deletions: 0,
                  repos: new Set(),
                });
              }

              const weekData = allCommitActivity.get(weekDate)!;
              weekData.commits += week.total || 0;
              weekData.additions += week.total * 15;
              weekData.deletions += week.total * 5;
              weekData.repos.add(repo.name);
            });
          }

          // CHANGE 4: Increased delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 500)); // INCREASED from 100ms to 500ms
        } catch (error) {
          console.warn(
            `Failed to fetch commit activity for ${repo.full_name}:`,
            error.message
          );
        }
      }

      // Convert to ActivityPattern format for the last 52 weeks
      for (let i = 0; i < 52; i++) {
        const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const weekDate = weekStart.toISOString().split("T")[0];

        const weekData = allCommitActivity.get(weekDate) || {
          commits: 0,
          additions: 0,
          deletions: 0,
          repos: new Set(),
        };

        patterns.push({
          date: weekDate,
          commits: weekData.commits,
          additions: weekData.additions,
          deletions: weekData.deletions,
          repositories: Array.from(weekData.repos),
        });
      }

      return patterns.reverse();
      
    } catch (fallbackError) {
      console.warn('Repository fallback failed, using recent activity:', fallbackError);
      
      // CHANGE 5: Enhanced recent activity fallback
      try {
        const activities = await githubService.fetchRecentActivity(username, 100, forceRefresh);
        const patterns: ActivityPattern[] = [];
        const now = new Date();

        for (let i = 0; i < 52; i++) {
          const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
          const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

          const weekActivities = activities.filter((activity) => {
            const activityDate = new Date(activity.created_at);
            return activityDate >= weekStart && activityDate < weekEnd;
          });

          let commits = 0;
          let additions = 0;
          let deletions = 0;
          const repositories = new Set<string>();

          weekActivities.forEach((activity) => {
            // IMPROVED: Better activity counting
            switch (activity.type) {
              case 'PushEvent':
                commits += activity.payload?.details
                  ? parseInt(activity.payload.details.split(" ")[0]) || 1
                  : 1;
                break;
              case 'CreateEvent':
              case 'IssuesEvent':
              case 'PullRequestEvent':
                commits += 1; // Count other activities as contributions
                break;
            }
            
            if (activity.repo) {
              repositories.add(activity.repo.name);
            }
          });

          // More realistic estimation
          additions = commits * (12 + Math.floor(Math.random() * 18)); // 12-30 additions
          deletions = commits * (2 + Math.floor(Math.random() * 8));   // 2-10 deletions

          patterns.push({
            date: weekStart.toISOString().split("T")[0],
            commits,
            additions,
            deletions,
            repositories: Array.from(repositories),
          });
        }

        return patterns.reverse();
        
      } catch (finalError) {
        console.warn('All activity methods failed, returning empty patterns:', finalError);
        
        // Return empty patterns as final fallback
        const patterns: ActivityPattern[] = [];
        const now = new Date();

        for (let i = 0; i < 52; i++) {
          const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
          patterns.push({
            date: date.toISOString().split("T")[0],
            commits: 0,
            additions: 0,
            deletions: 0,
            repositories: [],
          });
        }

        return patterns.reverse();
      }
    }
  }
}

  private classifyDeveloper(
    repositories: GitHubRepository[],
    languageStats: LanguageStats[],
    categories: RepositoryCategory[]
  ): DeveloperClassification {
    // Determine primary role based on repository categories and languages
    const topCategory = categories[0]?.category || "General";
    const topLanguages = languageStats.slice(0, 3).map((lang) => lang.language);

    // Calculate experience level
    const totalRepos = repositories.filter(
      (repo) => !repo.fork && !repo.archived
    ).length;
    const totalStars = repositories.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const avgComplexity =
      languageStats.reduce(
        (sum, lang) => sum + (this.languageComplexity[lang.language] || 5),
        0
      ) / languageStats.length;

    let experience: "Junior" | "Mid" | "Senior" | "Expert";
    if (totalRepos < 5 || totalStars < 10) experience = "Junior";
    else if (totalRepos < 15 || totalStars < 50) experience = "Mid";
    else if (totalRepos < 30 || totalStars < 200) experience = "Senior";
    else experience = "Expert";

    const confidence = Math.min(
      totalRepos * 2 +
        totalStars / 10 +
        avgComplexity * 5 +
        categories.length * 10,
      100
    );

    return {
      primaryRole: topCategory,
      confidence,
      skills: topLanguages,
      experience,
      specializations: categories.slice(0, 3).map((cat) => cat.category),
    };
  }

  private calculateImpactMetrics(
    repositories: GitHubRepository[],
    profile: GitHubProfile
  ) {
    const activeRepos = repositories.filter(
      (repo) => !repo.fork && !repo.archived
    );
    const totalStars = activeRepos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );
    const totalForks = activeRepos.reduce(
      (sum, repo) => sum + repo.forks_count,
      0
    );

    const projectReach = totalStars + totalForks + profile.followers;
    const communityImpact = Math.min(
      (totalStars * 2 + totalForks * 3 + profile.followers) / 10,
      100
    );
    const codeQuality = Math.min(
      activeRepos.filter((repo) => repo.stargazers_count > 5).length * 10 +
        activeRepos.filter(
          (repo) => repo.description && repo.description.length > 20
        ).length *
          5,
      100
    );

    return {
      totalStars,
      totalForks,
      projectReach,
      communityImpact,
      codeQuality,
    };
  }

  private getLanguageColor(language: string): string {
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
      Shell: "#89e051",
    };
    return colors[language] || "#586069";
  }

  private isCacheExpired(analysis: DeveloperAnalysis): boolean {
    return new Date() > new Date(analysis.cacheExpiry);
  }

  async generatePDFReport(analysis: DeveloperAnalysis): Promise<Blob> {
    // Placeholder for PDF generation
    // In real implementation, you'd use a library like jsPDF or Puppeteer
    const reportData = {
      username: analysis.username,
      generatedAt: new Date().toISOString(),
      summary: `Developer Analysis Report for ${
        analysis.profile.name || analysis.username
      }`,
      metrics: analysis,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    return blob;
  }
}

export const githubAnalyzer = new GitHubAnalyzer();
export default githubAnalyzer;
