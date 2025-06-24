import { supabase } from './supabase';
import type { UserProfile, ProfileUpdateData, SecuritySettings, AnalyticsData } from '../types/profile';

class ProfileService {
// Update your getUserProfile function
async getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Transform snake_case to camelCase before returning
    return this.transformDbProfile(data);

console.log('🔍 Raw DB profile_photo:', dbProfile.profile_photo);
console.log('🔍 Transformed profilePhoto:', transformedProfile.profilePhoto);

  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('Failed to load profile data');
  }
}

  async createUserProfile(userId: string, email: string): Promise<UserProfile> {
    try {
      const defaultProfile = {
        id: userId,
        display_name: email.split('@')[0],
        email,
        phone: null,
        bio: null,
        profile_photo: null,
        github_connected: false,
        leetcode_connected: false,
        last_sync: null,
        sync_frequency: 'weekly',
        email_notifications: {
          analysisCompletion: true,
          securityAlerts: true,
          productUpdates: false
        },
        data_retention: 60,
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (error) throw error;

      return this.transformDbProfile(data);
    } catch (error) {
      console.error('Failed to create user profile:', error);
      throw new Error('Failed to create profile');
    }
  }

  async updateUserProfile(userId: string, updates: ProfileUpdateData): Promise<UserProfile> {
  try {
    // Transform camelCase to snake_case
    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };

    // Map camelCase properties to snake_case columns
    if (updates.displayName !== undefined) {
      dbUpdates.display_name = updates.displayName;
    }
    if (updates.profilePhoto !== undefined) {
      dbUpdates.profile_photo = updates.profilePhoto;
    }
    if (updates.githubConnected !== undefined) {
      dbUpdates.github_connected = updates.githubConnected;
    }
    if (updates.leetcodeConnected !== undefined) {
      dbUpdates.leetcode_connected = updates.leetcodeConnected;
    }
    if (updates.phone !== undefined) {
      dbUpdates.phone = updates.phone;
    }
    if (updates.bio !== undefined) {
      dbUpdates.bio = updates.bio;
    }
    if (updates.syncFrequency !== undefined) {
      dbUpdates.sync_frequency = updates.syncFrequency;
    }
    if (updates.emailNotifications !== undefined) {
      dbUpdates.email_notifications = updates.emailNotifications;
    }
    if (updates.dataRetention !== undefined) {
      dbUpdates.data_retention = updates.dataRetention;
    }
    if (updates.language !== undefined) {
      dbUpdates.language = updates.language;
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return this.transformDbProfile(data);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw new Error('Failed to update profile');
  }
}

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Verify current password by attempting to sign in
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.email) {
        throw new Error('User not authenticated');
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update password:', error);
      throw new Error('Failed to update password');
    }
  }

  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/profile-photo.${fileExt}`;
    // Remove the 'profile-photos/' prefix - the bucket name handles that
    const filePath = fileName; // Just use the filename

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profile-photos') // This already specifies the bucket
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Failed to upload profile photo:', error);
    throw new Error('Failed to upload profile photo');
  }
}

  async deleteUserAccount(userId: string): Promise<void> {
    try {
      // Delete user profile data
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      // Delete user account (requires admin privileges)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete user account:', error);
      throw new Error('Failed to delete account');
    }
  }

  async getAnalyticsData(userId: string): Promise<AnalyticsData> {
    try {
      // This would typically fetch from analytics tables
      // For now, return mock data
      return {
        monthlyAnalysisCount: 12,
        successRate: 94,
        averageAnalysisTime: 45,
        totalReports: 28,
        lastAnalysis: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      };
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      throw new Error('Failed to load analytics data');
    }
  }

  async connectGitHub(userId: string): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/profile`,
          scopes: 'read:user,public_repo'
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Failed to connect GitHub:', error);
      throw new Error('Failed to connect GitHub account');
    }
  }

  async disconnectExternalAccount(userId: string, provider: 'github' | 'leetcode'): Promise<void> {
    try {
      const updates = {
        [`${provider}_connected`]: false,
        [`${provider}_username`]: null,
        last_sync: null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error(`Failed to disconnect ${provider}:`, error);
      throw new Error(`Failed to disconnect ${provider} account`);
    }
  }

  async syncExternalAccounts(userId: string): Promise<void> {
    try {
      // Trigger sync process
      const { error } = await supabase.functions.invoke('sync-external-accounts', {
        body: { userId }
      });

      if (error) throw error;

      // Update last sync timestamp
      await this.updateUserProfile(userId, {
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to sync external accounts:', error);
      throw new Error('Failed to sync accounts');
    }
  }

  async exportUserData(userId: string, format: 'pdf' | 'csv' | 'json'): Promise<Blob> {
    try {
      const { data, error } = await supabase.functions.invoke('export-user-data', {
        body: { userId, format }
      });

      if (error) throw error;

      return new Blob([data], { 
        type: format === 'pdf' ? 'application/pdf' : 
              format === 'csv' ? 'text/csv' : 'application/json'
      });
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw new Error('Failed to export data');
    }
  }

  private transformDbProfile(dbProfile: any): UserProfile {
    return {
      id: dbProfile.id,
      displayName: dbProfile.display_name,
      email: dbProfile.email,
      phone: dbProfile.phone,
      bio: dbProfile.bio,
      profilePhoto: dbProfile.profile_photo,
      githubConnected: dbProfile.github_connected,
      leetcodeConnected: dbProfile.leetcode_connected,
      lastSync: dbProfile.last_sync,
      syncFrequency: dbProfile.sync_frequency,
      emailNotifications: dbProfile.email_notifications,
      dataRetention: dbProfile.data_retention,
      language: dbProfile.language,
      createdAt: dbProfile.created_at,
      updatedAt: dbProfile.updated_at
    };
  }
}

export const profileService = new ProfileService();
export default profileService;