import { supabase } from './supabase';

export interface ResumeDraft {
  id: string;
  user_id: string;
  name: string;
  latex_content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDraftData {
  name: string;
  latex_content: string;
}

export interface UpdateDraftData {
  name?: string;
  latex_content?: string;
}

class ResumeDraftService {
  async getUserDrafts(userId: string): Promise<ResumeDraft[]> {
    try {
      const { data, error } = await supabase
        .from('resume_drafts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch resume drafts:', error);
      throw new Error('Failed to load resume drafts');
    }
  }

  async createDraft(userId: string, draftData: CreateDraftData): Promise<ResumeDraft> {
    try {
      const { data, error } = await supabase
        .from('resume_drafts')
        .insert({
          user_id: userId,
          name: draftData.name,
          latex_content: draftData.latex_content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create resume draft:', error);
      throw new Error('Failed to save resume draft');
    }
  }

  async updateDraft(draftId: string, updates: UpdateDraftData): Promise<ResumeDraft> {
    try {
      const { data, error } = await supabase
        .from('resume_drafts')
        .update(updates)
        .eq('id', draftId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update resume draft:', error);
      throw new Error('Failed to update resume draft');
    }
  }

  async deleteDraft(draftId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resume_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete resume draft:', error);
      throw new Error('Failed to delete resume draft');
    }
  }

  async getDraft(draftId: string): Promise<ResumeDraft | null> {
    try {
      const { data, error } = await supabase
        .from('resume_drafts')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch resume draft:', error);
      throw new Error('Failed to load resume draft');
    }
  }
}

export const resumeDraftService = new ResumeDraftService();
export default resumeDraftService;