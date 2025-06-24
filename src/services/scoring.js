import githubService from './github';
import leetcodeService from './leetcode';

// Unified scoring system for GitHub + LeetCode analysis
class ScoringService {
  constructor() {
    this.weights = {
      github: {
        repositories: 0.25,
        languages: 0.20,
        collaboration: 0.25,
        complexity: 0.15,
        activity: 0.15
      },
      leetcode: {
        problemSolving: 0.35,
        contests: 0.25,
        consistency: 0.20,
        difficulty: 0.20
      },
      combined: {
        github: 0.60,
        leetcode: 0.40
      }
    };

    this.difficultyMultipliers = {
      'Easy': 1,
      'Medium': 2,
      'Hard': 3
    };

    this.algorithmCategories = {
      'Array': { weight: 1.0, core: true },
      'String': { weight: 1.0, core: true },
      'Hash Table': { weight: 1.2, core: true },
      'Dynamic Programming': { weight: 2.0, core: true },
      'Tree': { weight: 1.5, core: true },
      'Graph': { weight: 1.8, core: true },
      'Binary Search': { weight: 1.3, core: true },
      'Two Pointers': { weight: 1.1, core: true },
      'Sliding Window': { weight: 1.4, core: false },
      'Backtracking': { weight: 1.7, core: false },
      'Greedy': { weight: 1.5, core: false },
      'Divide and Conquer': { weight: 1.6, core: false },
      'Trie': { weight: 1.8, core: false },
      'Union Find': { weight: 1.9, core: false }
    };
  }

  // Calculate unified developer score
  async calculateUnifiedScore(githubUsername, leetcodeUsername) {
    try {
      if (!githubUsername || !leetcodeUsername) {
        throw new Error('Both GitHub and LeetCode usernames are required');
      }
      
      const [githubScore, leetcodeScore] = await Promise.all([
        this.calculateGitHubScore(githubUsername),
        this.calculateLeetCodeScore(leetcodeUsername)
      ]);

      const combinedScore = (
        githubScore.overall * this.weights.combined.github +
        leetcodeScore.overall * this.weights.combined.leetcode
      );

      return {
        overall: Math.round(combinedScore),
        github: githubScore,
        leetcode: leetcodeScore,
        breakdown: this.generateScoreBreakdown(githubScore, leetcodeScore),
        recommendations: this.generateRecommendations(githubScore, leetcodeScore),
        interviewReadiness: this.calculateInterviewReadiness(githubScore, leetcodeScore)
      };
    } catch (error) {
      throw new Error(`Failed to calculate unified score: ${error.message}`);
    }
  }

  // Calculate GitHub-specific scores
  async calculateGitHubScore(username) {
    if (!username) {
      throw new Error('GitHub username is required');
    }
    
    const profile = await githubService.fetchUserProfile(username);
    const repositories = await githubService.fetchUserRepositories(username);
    const languageStats = await githubService.fetchLanguageStats(username);

    const repositoryScore = this.calculateRepositoryScore(repositories, profile);
    const languageScore = this.calculateLanguageScore(languageStats, repositories);
    const collaborationScore = this.calculateCollaborationScore(repositories, profile);
    const complexityScore = this.calculateComplexityScore(repositories, languageStats);
    const activityScore = this.calculateActivityScore(repositories);

    const overall = (
      repositoryScore * this.weights.github.repositories +
      languageScore * this.weights.github.languages +
      collaborationScore * this.weights.github.collaboration +
      complexityScore * this.weights.github.complexity +
      activityScore * this.weights.github.activity
    );

    return {
      overall: Math.round(overall),
      repository: Math.round(repositoryScore),
      language: Math.round(languageScore),
      collaboration: Math.round(collaborationScore),
      complexity: Math.round(complexityScore),
      activity: Math.round(activityScore),
      details: {
        totalRepos: repositories.length,
        totalStars: repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0),
        totalForks: repositories.reduce((sum, repo) => sum + repo.forks_count, 0),
        primaryLanguages: languageStats.slice(0, 3).map(lang => lang.language)
      }
    };
  }

  // Calculate LeetCode-specific scores
  async calculateLeetCodeScore(username) {
    if (!username) {
      throw new Error('LeetCode username is required');
    }
    
    const profile = await leetcodeService.fetchUserProfile(username);
    const contestData = await leetcodeService.fetchContestData(username);
    const problemStats = await leetcodeService.fetchProblemStats(username);
    const submissions = await leetcodeService.fetchRecentSubmissions(username, 50);

    const problemSolvingScore = this.calculateProblemSolvingScore(profile, problemStats);
    const contestScore = this.calculateContestScore(contestData);
    const consistencyScore = this.calculateConsistencyScore(submissions);
    const difficultyScore = this.calculateDifficultyScore(problemStats);

    const overall = (
      problemSolvingScore * this.weights.leetcode.problemSolving +
      contestScore * this.weights.leetcode.contests +
      consistencyScore * this.weights.leetcode.consistency +
      difficultyScore * this.weights.leetcode.difficulty
    );

    return {
      overall: Math.round(overall),
      problemSolving: Math.round(problemSolvingScore),
      contest: Math.round(contestScore),
      consistency: Math.round(consistencyScore),
      difficulty: Math.round(difficultyScore),
      details: {
        totalSolved: this.getTotalSolved(problemStats),
        contestRating: contestData.ranking?.rating || 0,
        contestsAttended: contestData.ranking?.attendedContestsCount || 0,
        globalRanking: contestData.ranking?.globalRanking || 0,
        algorithmCoverage: this.calculateAlgorithmCoverage(problemStats)
      }
    };
  }

  // GitHub scoring methods
  calculateRepositoryScore(repositories, profile) {
    const activeRepos = repositories.filter(repo => !repo.fork && !repo.archived);
    const repoCount = Math.min(activeRepos.length, 20); // Cap at 20 for scoring
    const qualityRepos = activeRepos.filter(repo => 
      repo.stargazers_count > 0 || 
      repo.forks_count > 0 || 
      (repo.description && repo.description.length > 20)
    );

    const countScore = (repoCount / 20) * 40; // Max 40 points
    const qualityScore = (qualityRepos.length / Math.max(activeRepos.length, 1)) * 60; // Max 60 points

    return Math.min(countScore + qualityScore, 100);
  }

  calculateLanguageScore(languageStats, repositories) {
    const languageCount = languageStats.length;
    const diversityScore = Math.min(languageCount * 8, 40); // Max 40 points

    // Calculate proficiency based on usage and complexity
    const complexityWeights = {
      'Assembly': 10, 'C': 9, 'C++': 9, 'Rust': 8, 'Go': 7,
      'Java': 7, 'C#': 6, 'Python': 5, 'JavaScript': 5,
      'TypeScript': 6, 'Ruby': 5, 'PHP': 4, 'HTML': 2, 'CSS': 3
    };

    const proficiencyScore = languageStats.reduce((score, lang) => {
      const complexity = complexityWeights[lang.language] || 5;
      const usage = lang.percentage / 100;
      return score + (complexity * usage * 6); // Max ~60 points
    }, 0);

    return Math.min(diversityScore + proficiencyScore, 100);
  }

  calculateCollaborationScore(repositories, profile) {
    const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);
    const followers = profile.followers;

    const starScore = Math.min(totalStars / 10, 30); // Max 30 points
    const forkScore = Math.min(totalForks / 5, 25); // Max 25 points
    const followerScore = Math.min(followers / 10, 25); // Max 25 points
    const engagementScore = Math.min((totalStars + totalForks) / repositories.length * 2, 20); // Max 20 points

    return Math.min(starScore + forkScore + followerScore + engagementScore, 100);
  }

  calculateComplexityScore(repositories, languageStats) {
    const activeRepos = repositories.filter(repo => !repo.fork && !repo.archived);
    const avgSize = activeRepos.reduce((sum, repo) => sum + repo.size, 0) / activeRepos.length;
    const multiLangRepos = activeRepos.filter(repo => 
      languageStats.some(lang => lang.language === repo.language && lang.percentage > 10)
    ).length;

    const sizeScore = Math.min(avgSize / 100, 30); // Max 30 points
    const diversityScore = Math.min(multiLangRepos * 5, 35); // Max 35 points
    const documentationScore = this.calculateDocumentationScore(activeRepos); // Max 35 points

    return Math.min(sizeScore + diversityScore + documentationScore, 100);
  }

  calculateActivityScore(repositories) {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
    
    const recentRepos = repositories.filter(repo => 
      new Date(repo.updated_at) > sixMonthsAgo && !repo.fork
    );

    const activityScore = Math.min(recentRepos.length * 8, 60); // Max 60 points
    const consistencyScore = repositories.length > 0 ? 
      (recentRepos.length / repositories.length) * 40 : 0; // Max 40 points

    return Math.min(activityScore + consistencyScore, 100);
  }

  calculateDocumentationScore(repositories) {
    const reposWithDescription = repositories.filter(repo => 
      repo.description && repo.description.length > 20
    ).length;
    const reposWithReadme = repositories.filter(repo => 
      repo.has_wiki || repo.has_pages
    ).length;

    const descriptionScore = repositories.length > 0 ? 
      (reposWithDescription / repositories.length) * 20 : 0;
    const readmeScore = repositories.length > 0 ? 
      (reposWithReadme / repositories.length) * 15 : 0;

    return descriptionScore + readmeScore;
  }

  // LeetCode scoring methods
  calculateProblemSolvingScore(profile, problemStats) {
    const totalSolved = this.getTotalSolved(problemStats);
    const solvedStats = problemStats.solvedStats || [];
    
    let weightedScore = 0;
    solvedStats.forEach(stat => {
      const multiplier = this.difficultyMultipliers[stat.difficulty] || 1;
      weightedScore += stat.count * multiplier;
    });

    const volumeScore = Math.min(totalSolved / 5, 40); // Max 40 points
    const weightedSolveScore = Math.min(weightedScore / 10, 60); // Max 60 points

    return Math.min(volumeScore + weightedSolveScore, 100);
  }

  calculateContestScore(contestData) {
    const ranking = contestData.ranking || {};
    const history = contestData.history || [];

    const rating = ranking.rating || 0;
    const attendedCount = ranking.attendedContestsCount || 0;
    const globalRanking = ranking.globalRanking || 0;

    const ratingScore = Math.min(rating / 25, 40); // Max 40 points (2500+ rating)
    const participationScore = Math.min(attendedCount * 2, 30); // Max 30 points
    const rankingScore = globalRanking > 0 ? 
      Math.min((100000 - globalRanking) / 3333, 30) : 0; // Max 30 points

    return Math.min(ratingScore + participationScore + rankingScore, 100);
  }

  calculateConsistencyScore(submissions) {
    if (submissions.length === 0) return 0;

    const acceptedSubmissions = submissions.filter(sub => sub.status === 'Accepted');
    const acceptanceRate = acceptedSubmissions.length / submissions.length;

    // Calculate submission frequency (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentSubmissions = submissions.filter(sub => 
      parseInt(sub.timestamp) * 1000 > thirtyDaysAgo
    );

    const acceptanceScore = acceptanceRate * 60; // Max 60 points
    const frequencyScore = Math.min(recentSubmissions.length * 2, 40); // Max 40 points

    return Math.min(acceptanceScore + frequencyScore, 100);
  }

  calculateDifficultyScore(problemStats) {
    const solvedStats = problemStats.solvedStats || [];
    const beatsStats = problemStats.beatsStats || [];

    let difficultyScore = 0;
    solvedStats.forEach(stat => {
      const multiplier = this.difficultyMultipliers[stat.difficulty] || 1;
      const percentage = stat.count > 0 ? Math.min(stat.count / 50, 1) : 0; // Normalize to 50 problems
      difficultyScore += percentage * multiplier * 25; // Max 75 points for Hard problems
    });

    // Bonus for beating percentage
    const avgBeatsPercentage = beatsStats.length > 0 ?
      beatsStats.reduce((sum, stat) => sum + (stat.percentage || 0), 0) / beatsStats.length : 0;
    const beatsScore = (avgBeatsPercentage / 100) * 25; // Max 25 points

    return Math.min(difficultyScore + beatsScore, 100);
  }

  // Helper methods
  getTotalSolved(problemStats) {
    const solvedStats = problemStats.solvedStats || [];
    return solvedStats.reduce((total, stat) => total + stat.count, 0);
  }

  calculateAlgorithmCoverage(problemStats) {
    const tagStats = problemStats.tagStats || {};
    const allTags = [
      ...(tagStats.fundamental || []),
      ...(tagStats.intermediate || []),
      ...(tagStats.advanced || [])
    ];

    const coveredAlgorithms = allTags.filter(tag => 
      this.algorithmCategories[tag.tagName] && tag.problemsSolved > 0
    );

    const coreAlgorithmsCovered = coveredAlgorithms.filter(tag =>
      this.algorithmCategories[tag.tagName]?.core
    );

    return {
      total: coveredAlgorithms.length,
      core: coreAlgorithmsCovered.length,
      percentage: (coveredAlgorithms.length / Object.keys(this.algorithmCategories).length) * 100
    };
  }

  // Generate detailed breakdown
  generateScoreBreakdown(githubScore, leetcodeScore) {
    return {
      strengths: this.identifyStrengths(githubScore, leetcodeScore),
      weaknesses: this.identifyWeaknesses(githubScore, leetcodeScore),
      balanceScore: this.calculateBalanceScore(githubScore, leetcodeScore),
      skillDistribution: {
        implementation: githubScore.overall,
        problemSolving: leetcodeScore.overall,
        collaboration: githubScore.collaboration,
        algorithms: leetcodeScore.difficulty
      }
    };
  }

  identifyStrengths(githubScore, leetcodeScore) {
    const strengths = [];
    
    if (githubScore.collaboration > 75) strengths.push('Strong collaboration and community engagement');
    if (githubScore.complexity > 80) strengths.push('Excellent project complexity and architecture skills');
    if (leetcodeScore.problemSolving > 80) strengths.push('Outstanding problem-solving abilities');
    if (leetcodeScore.contest > 70) strengths.push('Strong competitive programming skills');
    if (githubScore.language > 85) strengths.push('Exceptional language diversity and proficiency');

    return strengths;
  }

  identifyWeaknesses(githubScore, leetcodeScore) {
    const weaknesses = [];
    
    if (githubScore.repository < 50) weaknesses.push('Limited repository portfolio');
    if (leetcodeScore.consistency < 60) weaknesses.push('Inconsistent problem-solving practice');
    if (leetcodeScore.contest < 40) weaknesses.push('Limited competitive programming experience');
    if (githubScore.activity < 50) weaknesses.push('Low recent development activity');
    if (leetcodeScore.difficulty < 60) weaknesses.push('Need to tackle more challenging problems');

    return weaknesses;
  }

  calculateBalanceScore(githubScore, leetcodeScore) {
    const difference = Math.abs(githubScore.overall - leetcodeScore.overall);
    return Math.max(100 - difference, 0);
  }

  // Generate recommendations
  generateRecommendations(githubScore, leetcodeScore) {
    const recommendations = [];

    if (githubScore.repository < 60) {
      recommendations.push({
        category: 'GitHub',
        priority: 'High',
        action: 'Create more diverse projects',
        description: 'Build 3-5 new repositories showcasing different technologies and problem domains'
      });
    }

    if (leetcodeScore.consistency < 70) {
      recommendations.push({
        category: 'LeetCode',
        priority: 'High',
        action: 'Establish consistent practice routine',
        description: 'Solve at least 3-5 problems per week to improve consistency score'
      });
    }

    if (leetcodeScore.difficulty < 65) {
      recommendations.push({
        category: 'LeetCode',
        priority: 'Medium',
        action: 'Focus on medium and hard problems',
        description: 'Increase the ratio of medium/hard problems to improve difficulty score'
      });
    }

    if (githubScore.collaboration < 60) {
      recommendations.push({
        category: 'GitHub',
        priority: 'Medium',
        action: 'Increase community engagement',
        description: 'Contribute to open source projects and improve project documentation'
      });
    }

    return recommendations;
  }

  // Calculate interview readiness
  calculateInterviewReadiness(githubScore, leetcodeScore) {
    const algorithmReadiness = (leetcodeScore.problemSolving * 0.4 + leetcodeScore.difficulty * 0.6);
    const systemDesignReadiness = (githubScore.complexity * 0.6 + githubScore.collaboration * 0.4);
    const codingReadiness = (githubScore.language * 0.3 + leetcodeScore.consistency * 0.7);
    const behavioralReadiness = (githubScore.collaboration * 0.7 + githubScore.activity * 0.3);

    const overall = (algorithmReadiness + systemDesignReadiness + codingReadiness + behavioralReadiness) / 4;

    return {
      overall: Math.round(overall),
      algorithm: Math.round(algorithmReadiness),
      systemDesign: Math.round(systemDesignReadiness),
      coding: Math.round(codingReadiness),
      behavioral: Math.round(behavioralReadiness),
      readinessLevel: this.getReadinessLevel(overall),
      recommendations: this.getInterviewRecommendations(algorithmReadiness, systemDesignReadiness, codingReadiness, behavioralReadiness)
    };
  }

  getReadinessLevel(score) {
    if (score >= 85) return 'Excellent - Ready for top-tier companies';
    if (score >= 75) return 'Good - Ready for most companies';
    if (score >= 65) return 'Fair - Need some preparation';
    if (score >= 50) return 'Basic - Significant preparation needed';
    return 'Beginner - Extensive preparation required';
  }

  getInterviewRecommendations(algorithm, systemDesign, coding, behavioral) {
    const recommendations = [];

    if (algorithm < 70) {
      recommendations.push('Focus on data structures and algorithms practice');
    }
    if (systemDesign < 70) {
      recommendations.push('Study system design patterns and build scalable projects');
    }
    if (coding < 70) {
      recommendations.push('Practice coding in your preferred language and improve consistency');
    }
    if (behavioral < 70) {
      recommendations.push('Prepare behavioral stories and showcase collaboration experience');
    }

    return recommendations;
  }
}

export const scoringService = new ScoringService();
export default scoringService;