import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Save, 
  FileText, 
  Download, 
  Eye, 
  EyeOff, 
  Home, 
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  FileCode,
  Loader
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DarkModeToggle } from '../components/ui/DarkModeToggle';
import { LaTeXEditor } from '../components/resume/LaTeXEditor';
import { LaTeXPreview } from '../components/resume/LaTeXPreview';
import { TemplateSelector } from '../components/resume/TemplateSelector';
import { DraftManager } from '../components/resume/DraftManager';
import { useAuth } from '../contexts/AuthContext';
import { getDefaultTemplate, LATEX_TEMPLATES } from '../utils/latexTemplates';
import { supabase } from '../services/supabase';
import { showToast } from '../components/ui/Toast';

export function LaTeXResumeBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [latexContent, setLatexContent] = useState(getDefaultTemplate().content);
  const [currentTemplateId, setCurrentTemplateId] = useState(getDefaultTemplate().id);
  const [showPreview, setShowPreview] = useState(true);
  const [compiling, setCompiling] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);
  
  // For mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleTemplateChange = (template) => {
    if (latexContent !== getDefaultTemplate().content) {
      if (!confirm('Changing templates will replace your current content. Continue?')) {
        return;
      }
    }
    
    setLatexContent(template.content);
    setCurrentTemplateId(template.id);
  };
  
  // In your LaTeXResumeBuilder.tsx, add this fallback:
const handleExportPDF = () => {
  try {
    // Create a blob with the LaTeX content
    const blob = new Blob([latexContent], { type: 'text/plain' });
    
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.tex';
    link.style.display = 'none';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    showToast.success('LaTeX file downloaded successfully');
  } catch (error) {
    console.error('Download failed:', error);
    showToast.error('Failed to download file. Please try again.');
  }
};
    
    setCompiling(true);
    setCompilationError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('latex-compiler', {
        body: { latexContent }
      });
      
      if (error) throw new Error(error.message);
      
      // Create a blob from the PDF data
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      showToast.success('PDF exported successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      setCompilationError(error.message);
      showToast.error('Failed to export PDF. Please try again.');
    } finally {
      setCompiling(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Link 
              to="/" 
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link 
              to="/dashboard" 
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-white font-medium">
              LaTeX Resume Builder
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileCode className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" />
                LaTeX Resume Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Create professional resumes with LaTeX
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <DarkModeToggle />
              {user ? (
                <DraftManager 
                  currentContent={latexContent}
                  onLoadDraft={setLatexContent}
                />
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/auth/signin')}
                >
                  Sign in to save
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between py-2 gap-2">
            <div className="flex items-center space-x-2">
              <TemplateSelector 
                onSelectTemplate={handleTemplateChange}
                currentTemplateId={currentTemplateId}
              />
              
              <Button
                variant="outline"
                icon={Download}
                onClick={handleExportPDF}
                disabled={compiling}
                loading={compiling}
              >
                Export PDF
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {isMobile && (
                <Button
                  variant="outline"
                  icon={showPreview ? EyeOff : Eye}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              )}
              
              {compilationError && (
                <div className="text-red-600 dark:text-red-400 text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Compilation failed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
          {/* Editor */}
          {(!isMobile || !showPreview) && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">LaTeX Editor</h2>
              <LaTeXEditor 
                value={latexContent}
                onChange={setLatexContent}
              />
            </div>
          )}
          
          {/* Preview */}
          {(!isMobile || showPreview) && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Preview</h2>
              <LaTeXPreview latexContent={latexContent} />
            </div>
          )}
        </div>
        
        {/* Tips and Resources */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">LaTeX Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Common Commands</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc pl-5">
                <li>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    {'\\textbf{text}'}
                  </code>{' '}
                  – Bold text
                </li>
                <li>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    {'\\textit{text}'}
                  </code>{' '}
                  – Italic text
                </li>
                <li>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    {'\\section{title}'}
                  </code>{' '}
                  – Create a section
                </li>
                <li>
                  <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
                    {'\\begin{itemize} \\item … \\end{itemize}'}
                  </code>{' '}
                  – Bullet list
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resources</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li><a href="https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Learn LaTeX in 30 minutes</a></li>
                <li><a href="https://www.overleaf.com/learn/latex/Sections_and_chapters" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Sections and structure</a></li>
                <li><a href="https://www.overleaf.com/learn/latex/Lists" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Creating lists</a></li>
                <li><a href="https://www.overleaf.com/learn/latex/Tables" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Tables in LaTeX</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}