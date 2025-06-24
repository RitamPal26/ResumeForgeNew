import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Mail, 
  Phone, 
  Github, 
  Code, 
  Shield, 
  Settings, 
  Bell, 
  BarChart3,
  Save,
  Upload,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Palette,
  Database,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import profileService from '../services/profileService';
import type { UserProfile } from '../types/profile';

// Validation schemas
const personalInfoSchema = yup.object({
  displayName: yup.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters')
    .required('Display name is required'),
  phone: yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
    .optional(),
  bio: yup.string()
    .max(160, 'Bio must be less than 160 characters')
    .optional()
});

const securitySchema = yup.object({
  currentPassword: yup.string()
    .required('Current password is required'),
  newPassword: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

export function ProfileSettings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form instances
  const personalForm = useForm({
    resolver: yupResolver(personalInfoSchema),
    mode: 'onChange'
  });

  const securityForm = useForm({
    resolver: yupResolver(securitySchema),
    mode: 'onChange'
  });

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let profile = await profileService.getUserProfile(user.id);
      
      // If no profile exists, create one
      if (!profile) {
        profile = await profileService.createUserProfile(user.id, user.email || '');
      }
      
      setUserProfile(profile);
      
      // Set form default values
      personalForm.reset({
        displayName: profile.displayName,
        phone: profile.phone || '',
        bio: profile.bio || ''
      });
      
    } catch (error) {
      console.error('Failed to load user profile:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalInfoSubmit = async (data: any) => {
    if (!user || !userProfile) return;
    
    setSaveStatus('saving');
    setError(null);
    
    try {
      const updatedProfile = await profileService.updateUserProfile(user.id, {
        displayName: data.displayName,
        phone: data.phone || null,
        bio: data.bio || null
      });
      
      setUserProfile(updatedProfile);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to save changes. Please try again.');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleSecuritySubmit = async (data: any) => {
    setSaveStatus('saving');
    setError(null);
    
    try {
      await profileService.updatePassword(data.currentPassword, data.newPassword);
      
      setSaveStatus('saved');
      securityForm.reset();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update password:', error);
      setError('Failed to update password. Please check your current password and try again.');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPG and PNG files are allowed');
        return;
      }
      
      setProfilePhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfilePhoto = async () => {
    if (!profilePhotoFile || !user) return;
    
    setSaveStatus('saving');
    setError(null);
    
    try {
      const photoUrl = await profileService.uploadProfilePhoto(user.id, profilePhotoFile);
      
      const updatedProfile = await profileService.updateUserProfile(user.id, {
        profilePhoto: photoUrl
      });
      
      setUserProfile(updatedProfile);
      setSaveStatus('saved');
      setProfilePhotoFile(null);
      setProfilePhotoPreview(null);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setError('Failed to upload profile photo. Please try again.');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleGitHubConnect = async () => {
    if (!user) return;
    
    try {
      await profileService.connectGitHub(user.id);
    } catch (error) {
      console.error('GitHub connection failed:', error);
      setError('Failed to connect GitHub account. Please try again.');
    }
  };

  const handleManualSync = async () => {
    if (!userProfile || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.syncExternalAccounts(user.id);
      
      // Reload profile to get updated sync time
      const updatedProfile = await profileService.getUserProfile(user.id);
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setError('Failed to sync accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    setShowDeleteModal(false);
    setError(null);
    
    // Show warning about account deletion not being available
    setError('Account deletion is not available through the client interface for security reasons. Please contact support to delete your account.');
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    if (!user || !userProfile) return;
    
    try {
      const updatedProfile = await profileService.updateUserProfile(user.id, {
        emailNotifications: {
          ...userProfile.emailNotifications,
          [key]: value
        }
      });
      
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update notifications:', error);
      setError('Failed to update notification preferences.');
    }
  };

  const handlePreferenceChange = async (key: string, value: any) => {
    if (!user || !userProfile) return;
    
    try {
      const updatedProfile = await profileService.updateUserProfile(user.id, {
        [key]: value
      });
      
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to update preference:', error);
      setError('Failed to update preference.');
    }
  };

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'accounts', label: 'External Accounts', icon: LinkIcon },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'preferences', label: 'User Preferences', icon: Settings },
    { id: 'analytics', label: 'Analytics Overview', icon: BarChart3 }
  ];

  if (loading && !userProfile) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="lg\" text="Loading profile settings..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white transition-colors duration-300">
                Profile Settings
              </h1>
              <p className="text-secondary-600 dark:text-secondary-300 mt-1 transition-colors duration-300">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {saveStatus === 'saving' && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm">Saving...</span>
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Saved</span>
                </div>
              )}
              <Button
                onClick={() => {
                  if (activeSection === 'personal') {
                    personalForm.handleSubmit(handlePersonalInfoSubmit)();
                  } else if (activeSection === 'security') {
                    securityForm.handleSubmit(handleSecuritySubmit)();
                  }
                }}
                disabled={saveStatus === 'saving'}
                icon={Save}
              >
                Save Changes
              </Button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-600'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-sm border border-secondary-200 dark:border-secondary-700 transition-colors duration-300">
              
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 transition-colors duration-300">
                    Personal Information
                  </h2>
                  
                  <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-6">
                    {/* Profile Photo */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3 transition-colors duration-300">
                        Profile Photo
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-secondary-200 dark:bg-secondary-600 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300">
                          {profilePhotoPreview || userProfile?.profilePhoto ? (
                            <img
                              src={profilePhotoPreview || userProfile?.profilePhoto}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-secondary-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleProfilePhotoChange}
                            className="hidden"
                            id="profile-photo"
                          />
                          <label
                            htmlFor="profile-photo"
                            className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors duration-200"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload Photo</span>
                          </label>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 transition-colors duration-300">
                            JPG or PNG, max 5MB
                          </p>
                        </div>
                        {profilePhotoFile && (
                          <Button onClick={uploadProfilePhoto} size="sm">
                            Save Photo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <Input
                        label="Display Name"
                        {...personalForm.register('displayName')}
                        error={personalForm.formState.errors.displayName?.message}
                        placeholder="Enter your display name"
                      />
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <Input
                        label="Email Address"
                        value={user?.email || ''}
                        disabled
                        className="bg-secondary-50 dark:bg-secondary-700"
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 transition-colors duration-300">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <Input
                        label="Phone Number (Optional)"
                        {...personalForm.register('phone')}
                        error={personalForm.formState.errors.phone?.message}
                        placeholder="+1234567890"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                        Bio / Tagline
                      </label>
                      <textarea
                        {...personalForm.register('bio')}
                        rows={3}
                        maxLength={160}
                        className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 transition-colors duration-300">
                          Brief description for your profile
                        </p>
                        <span className="text-xs text-secondary-500 dark:text-secondary-400 transition-colors duration-300">
                          {personalForm.watch('bio')?.length || 0}/160
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* External Accounts */}
              {activeSection === 'accounts' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 transition-colors duration-300">
                    External Accounts
                  </h2>
                  
                  <div className="space-y-6">
                    {/* GitHub Integration */}
                    <div className="border border-secondary-200 dark:border-secondary-600 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-900 rounded-lg">
                            <Github className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                              GitHub
                            </h3>
                            <p className="text-sm text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
                              Connect your GitHub account for repository analysis
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {userProfile?.githubConnected ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </span>
                          ) : (
                            <Button onClick={handleGitHubConnect} size="sm">
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {userProfile?.githubConnected && userProfile.lastSync && (
                        <div className="text-sm text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
                          <p>Last sync: {new Date(userProfile.lastSync).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {/* LeetCode Integration */}
                    <div className="border border-secondary-200 dark:border-secondary-600 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-orange-500 rounded-lg">
                            <Code className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                              LeetCode
                            </h3>
                            <p className="text-sm text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
                              Connect your LeetCode profile for problem-solving analysis
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {userProfile?.leetcodeConnected ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Connected
                            </span>
                          ) : (
                            <Button size="sm" variant="outline">
                              Manual Setup
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sync Settings */}
                    <div className="border border-secondary-200 dark:border-secondary-600 rounded-lg p-4 transition-colors duration-300">
                      <h3 className="font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Sync Settings
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                            Sync Frequency
                          </label>
                          <select
                            value={userProfile?.syncFrequency || 'weekly'}
                            onChange={(e) => handlePreferenceChange('syncFrequency', e.target.value)}
                            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="manual">Manual Only</option>
                          </select>
                        </div>
                        
                        <Button
                          onClick={handleManualSync}
                          disabled={loading}
                          icon={RefreshCw}
                          variant="outline"
                          className="w-full"
                        >
                          {loading ? 'Syncing...' : 'Sync Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 transition-colors duration-300">
                    Security Settings
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Change Password */}
                    <div>
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Change Password
                      </h3>
                      
                      <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-4">
                        <Input
                          label="Current Password"
                          type="password"
                          {...securityForm.register('currentPassword')}
                          error={securityForm.formState.errors.currentPassword?.message}
                        />
                        
                        <div className="relative">
                          <Input
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            {...securityForm.register('newPassword')}
                            error={securityForm.formState.errors.newPassword?.message}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        <Input
                          label="Confirm New Password"
                          type="password"
                          {...securityForm.register('confirmPassword')}
                          error={securityForm.formState.errors.confirmPassword?.message}
                        />
                        
                        <div className="text-xs text-secondary-500 dark:text-secondary-400 transition-colors duration-300">
                          Password must be at least 8 characters with 1 uppercase letter and 1 number
                        </div>
                      </form>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="border-t border-secondary-200 dark:border-secondary-600 pt-8 transition-colors duration-300">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Two-Factor Authentication
                      </h3>
                      
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 transition-colors duration-300">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">2FA Setup Coming Soon</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              Two-factor authentication will be available in the next update to enhance your account security.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div className="border-t border-secondary-200 dark:border-secondary-600 pt-8 transition-colors duration-300">
                      <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">
                        Danger Zone
                      </h3>
                      
                      <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-red-800 dark:text-red-200">Delete Account</h4>
                            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                              Permanently delete your account and all associated data
                            </p>
                          </div>
                          <Button
                            onClick={() => setShowDeleteModal(true)}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            icon={Trash2}
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Preferences */}
              {activeSection === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 transition-colors duration-300">
                    User Preferences
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Theme Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Appearance
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Palette className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                            <div>
                              <p className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                                Theme
                              </p>
                              <p className="text-sm text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
                                Choose your preferred color scheme
                              </p>
                            </div>
                          </div>
                          <Button onClick={toggleTheme} variant="outline">
                            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                          </Button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                            Language
                          </label>
                          <select
                            value={userProfile?.language || 'en'}
                            onChange={(e) => handlePreferenceChange('language', e.target.value)}
                            className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Email Notifications */}
                    <div className="border-t border-secondary-200 dark:border-secondary-600 pt-8 transition-colors duration-300">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Email Notifications
                      </h3>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'analysisCompletion', label: 'Analysis Completion', description: 'Get notified when your profile analysis is complete' },
                          { key: 'securityAlerts', label: 'Security Alerts', description: 'Important security updates and login notifications' },
                          { key: 'productUpdates', label: 'Product Updates', description: 'New features and product announcements' }
                        ].map((notification) => (
                          <div key={notification.key} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                              <div>
                                <p className="font-medium text-secondary-900 dark:text-white transition-colors duration-300">
                                  {notification.label}
                                </p>
                                <p className="text-sm text-secondary-600 dark:text-secondary-300 transition-colors duration-300">
                                  {notification.description}
                                </p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={userProfile?.emailNotifications[notification.key as keyof typeof userProfile.emailNotifications] || false}
                                onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                                className="sr-only"
                              />
                              <div className="w-11 h-6 bg-secondary-200 dark:bg-secondary-600 rounded-full peer peer-checked:bg-primary-600 transition-colors duration-300">
                                <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 peer-checked:translate-x-5 translate-x-0.5 translate-y-0.5"></div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Data Retention */}
                    <div className="border-t border-secondary-200 dark:border-secondary-600 pt-8 transition-colors duration-300">
                      <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Data Management
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 transition-colors duration-300">
                          Data Retention Period
                        </label>
                        <select
                          value={userProfile?.dataRetention || 60}
                          onChange={(e) => handlePreferenceChange('dataRetention', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white transition-colors duration-300"
                        >
                          <option value={30}>30 days</option>
                          <option value={60}>60 days</option>
                          <option value={90}>90 days</option>
                        </select>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 transition-colors duration-300">
                          How long to keep your analysis data and reports
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Overview */}
              {activeSection === 'analytics' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6 transition-colors duration-300">
                    Analytics Overview
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                          <div>
                            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">12</p>
                            <p className="text-sm text-primary-700 dark:text-primary-300">Analyses This Month</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">94%</p>
                            <p className="text-sm text-green-700 dark:text-green-300">Success Rate</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                          <div>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">45s</p>
                            <p className="text-sm text-orange-700 dark:text-orange-300">Avg Analysis Time</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export Options */}
                    <div className="border border-secondary-200 dark:border-secondary-600 rounded-lg p-4 transition-colors duration-300">
                      <h3 className="font-medium text-secondary-900 dark:text-white mb-4 transition-colors duration-300">
                        Export Data
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button icon={Download} variant="outline">
                          Export as PDF
                        </Button>
                        <Button icon={Download} variant="outline">
                          Export as CSV
                        </Button>
                        <Button icon={Calendar} variant="outline">
                          View Detailed History
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-xl p-6 max-w-md w-full mx-4 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">
              Delete Account
            </h3>
            <p className="text-secondary-700 dark:text-secondary-300 mb-6 transition-colors duration-300">
              Account deletion must be handled through our support team for security reasons. This ensures proper data cleanup and prevents unauthorized deletions.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAccountDeletion}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}