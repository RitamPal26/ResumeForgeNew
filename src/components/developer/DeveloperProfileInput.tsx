import React, { useState } from 'react';
import { Search, Github, Code, User, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface DeveloperProfileInputProps {
  onAnalyze: (githubUsername: string, leetcodeUsername: string) => void;
  loading: boolean;
  error?: string;
}

export function DeveloperProfileInput({ onAnalyze, loading, error }: DeveloperProfileInputProps) {
  const [githubUsername, setGithubUsername] = useState('');
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const [validationErrors, setValidationErrors] = useState<{github?: string; leetcode?: string}>({});

  const validateUsername = (username: string, platform: string) => {
    if (!username.trim()) {
      return `${platform} username is required`;
    }
    
    if (username.length < 1 || username.length > 39) {
      return `${platform} username must be between 1 and 39 characters`;
    }
    
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(username.trim())) {
      return `${platform} username contains invalid characters`;
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {github?: string; leetcode?: string} = {};
    
    const githubError = validateUsername(githubUsername, 'GitHub');
    const leetcodeError = validateUsername(leetcodeUsername, 'LeetCode');
    
    if (githubError) errors.github = githubError;
    if (leetcodeError) errors.leetcode = leetcodeError;
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      onAnalyze(githubUsername.trim(), leetcodeUsername.trim());
    }
  };

  const handleGithubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubUsername(e.target.value);
    if (validationErrors.github) {
      setValidationErrors(prev => ({ ...prev, github: undefined }));
    }
  };

  const handleLeetcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeetcodeUsername(e.target.value);
    if (validationErrors.leetcode) {
      setValidationErrors(prev => ({ ...prev, leetcode: undefined }));
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Developer Profile Analysis</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get comprehensive insights by analyzing both your GitHub repositories and LeetCode problem-solving skills. 
          Enter your usernames to generate a unified developer profile with interview readiness assessment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Analysis Failed</h4>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Github className="w-4 h-4 inline mr-2" />
              GitHub Username
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g., octocat"
                value={githubUsername}
                onChange={handleGithubChange}
                error={validationErrors.github}
                className="pl-10"
              />
              <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Your GitHub profile will be analyzed for repositories, languages, and collaboration metrics
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <Code className="w-4 h-4 inline mr-2" />
              LeetCode Username
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g., leetcoder"
                value={leetcodeUsername}
                onChange={handleLeetcodeChange}
                error={validationErrors.leetcode}
                className="pl-10"
              />
              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Your LeetCode profile will be analyzed for problem-solving skills and contest performance
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={loading || !githubUsername.trim() || !leetcodeUsername.trim()}
            icon={Search}
            iconPosition="left"
            className="px-8"
          >
            {loading ? 'Analyzing Profiles...' : 'Analyze Developer Profile'}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Analysis typically takes 30-60 seconds and includes:</p>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <span>• Repository Analysis</span>
            <span>• Problem-Solving Skills</span>
            <span>• Language Proficiency</span>
            <span>• Interview Readiness</span>
          </div>
        </div>
      </form>
    </div>
  );
}