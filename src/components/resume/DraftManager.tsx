import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, Trash2, FileText, Plus, X } from 'lucide-react';
import resumeDraftService, { ResumeDraft } from '../../services/resumeDraftService';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../ui/Toast';

interface DraftManagerProps {
  currentContent: string;
  onLoadDraft: (content: string) => void;
}

export function DraftManager({ currentContent, onLoadDraft }: DraftManagerProps) {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<ResumeDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [savingDraft, setSavingDraft] = useState(false);

  useEffect(() => {
    if (user) {
      loadDrafts();
    }
  }, [user]);

  const loadDrafts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userDrafts = await resumeDraftService.getUserDrafts(user.id);
      setDrafts(userDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
      showToast.error('Failed to load your saved drafts');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!user || !draftName.trim()) return;
    
    setSavingDraft(true);
    try {
      await resumeDraftService.createDraft(user.id, {
        name: draftName.trim(),
        latex_content: currentContent
      });
      
      showToast.success('Draft saved successfully');
      setShowSaveModal(false);
      setDraftName('');
      loadDrafts();
    } catch (error) {
      console.error('Failed to save draft:', error);
      showToast.error('Failed to save draft');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    
    try {
      await resumeDraftService.deleteDraft(draftId);
      setDrafts(drafts.filter(draft => draft.id !== draftId));
      showToast.success('Draft deleted');
    } catch (error) {
      console.error('Failed to delete draft:', error);
      showToast.error('Failed to delete draft');
    }
  };

  const handleLoadDraft = (draft: ResumeDraft) => {
    onLoadDraft(draft.latex_content);
    setShowLoadModal(false);
    showToast.success(`Loaded draft: ${draft.name}`);
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          icon={Save}
          onClick={() => setShowSaveModal(true)}
        >
          Save Draft
        </Button>
        <Button 
          variant="outline" 
          icon={FileText}
          onClick={() => setShowLoadModal(true)}
          disabled={drafts.length === 0}
        >
          Load Draft
        </Button>
      </div>

      {/* Save Draft Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Save Draft</h3>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Draft Name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="My Resume Draft"
                required
              />
              
              <div className="flex justify-end space-x-3 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSaveModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveDraft}
                  disabled={!draftName.trim() || savingDraft}
                  loading={savingDraft}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load Draft Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Load Draft</h3>
              <button 
                onClick={() => setShowLoadModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : drafts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No saved drafts found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {drafts.map((draft) => (
                  <div 
                    key={draft.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{draft.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(draft.updated_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLoadDraft(draft)}
                        className="p-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                        title="Load draft"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        title="Delete draft"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLoadModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}