import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, BarChart3, Settings, Upload, Eye, Edit, Trash2, User, History, FileCode } from 'lucide-react';
import { DeveloperProfileDashboard } from '../components/developer/DeveloperProfileDashboard';

export function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('overview');

  // Mock data for demonstration
  const resumes = [
    {
      id: 1,
      name: 'Software Engineer Resume',
      lastModified: '2 days ago',
      status: 'optimized',
      score: 85,
    },
    {
      id: 2,
      name: 'Marketing Manager Resume',
      lastModified: '1 week ago',
      status: 'draft',
      score: 72,
    },
    {
      id: 3,
      name: 'Product Manager Resume',
      lastModified: '3 weeks ago',
      status: 'reviewed',
      score: 91,
    },
  ];

  const stats = [
    {
      label: 'Total Resumes',
      value: '3',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      label: 'Average Score',
      value: '82',
      icon: BarChart3,
      color: 'bg-green-500',
    },
    {
      label: 'Applications Sent',
      value: '12',
      icon: Upload,
      color: 'bg-purple-500',
    },
    {
      label: 'Response Rate',
      value: '45%',
      icon: Eye,
      color: 'bg-orange-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-secondary-800 shadow-lg z-40 transition-colors duration-300">
        <div className="flex items-center space-x-3 p-6 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
          <div className="p-2 bg-primary-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-secondary-900 dark:text-white transition-colors duration-300">ResumeForge</span>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'text-secondary-700 dark:text-white bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-600'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <Link
                to="/resume-builder"
                className="flex items-center space-x-3 px-4 py-3 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
              >
                <FileCode className="w-5 h-5" />
                <span>LaTeX Resume Builder</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('developer')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'developer'
                    ? 'text-secondary-700 dark:text-white bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-600'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Developer Profile</span>
              </button>
            </li>
            <li>
              <Link
                to="/history"
                className="flex items-center space-x-3 px-4 py-3 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
              >
                <History className="w-5 h-5" />
                <span>Analysis History</span>
              </Link>
            </li>
            <li>
              <Link
                to="/templates"
                className="flex items-center space-x-3 px-4 py-3 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Templates</span>
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-3 text-secondary-600 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'overview' && (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-white transition-colors duration-300">Dashboard</h1>
                <p className="text-secondary-600 dark:text-secondary-300 mt-1 transition-colors duration-300">Manage and optimize your resumes</p>
              </div>
              <Button icon={Plus} iconPosition="left">
                Create New Resume
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 transition-colors duration-300">{stat.label}</p>
                      <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1 transition-colors duration-300">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Resumes */}
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
              <div className="p-6 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white transition-colors duration-300">Recent Resumes</h2>
                  <Link
                    to="/resumes"
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors duration-300"
                  >
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 dark:bg-secondary-700 transition-colors duration-300">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider transition-colors duration-300">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider transition-colors duration-300">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider transition-colors duration-300">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider transition-colors duration-300">
                        Last Modified
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider transition-colors duration-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700 transition-colors duration-300">
                    {resumes.map((resume) => (
                      <tr key={resume.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors duration-300">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-secondary-400 dark:text-secondary-500 mr-3 transition-colors duration-300" />
                            <span className="text-sm font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                              {resume.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              resume.status
                            )}`}
                          >
                            {resume.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-secondary-900 dark:text-white mr-2 transition-colors duration-300">
                              {resume.score}%
                            </span>
                            <div className="w-16 bg-secondary-200 dark:bg-secondary-600 rounded-full h-2 transition-colors duration-300">
                              <div
                                className={`h-2 rounded-full ${
                                  resume.score >= 80
                                    ? 'bg-green-500'
                                    : resume.score >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${resume.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400 transition-colors duration-300">
                          {resume.lastModified}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 transition-colors duration-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-all duration-300 cursor-pointer">
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4 transition-colors duration-300" />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2 transition-colors duration-300">Upload Resume</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm transition-colors duration-300">
                    Upload an existing resume to start optimizing it with our AI tools.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4 transition-colors duration-300" />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2 transition-colors duration-300">Start from Template</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm transition-colors duration-300">
                    Choose from our professionally designed templates to build your resume.
                  </p>
                </div>
                
                <Link to="/history" className="bg-white dark:bg-secondary-800 p-6 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 hover:shadow-md transition-all duration-300 cursor-pointer">
                  <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4 transition-colors duration-300" />
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2 transition-colors duration-300">View Analysis History</h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm transition-colors duration-300">
                    Track your progress and view detailed analysis reports over time.
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}

        {activeTab === 'developer' && <DeveloperProfileDashboard />}
      </div>
    </div>
  );
}