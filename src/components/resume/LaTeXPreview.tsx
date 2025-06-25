import React, { useEffect, useState } from 'react';
import { convertLatexToHtml } from '../../utils/latexToHtml';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LaTeXPreviewProps {
  latexContent: string;
  height?: string;
  className?: string;
}

export function LaTeXPreview({ latexContent, height = '70vh', className = '' }: LaTeXPreviewProps) {
  const [html, setHtml] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const renderLatex = async () => {
      setLoading(true);
      
      try {
        // Add a small delay to avoid too frequent re-renders
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { html, errors } = convertLatexToHtml(latexContent);
        setHtml(html);
        setErrors(errors);
      } catch (error) {
        console.error('Error rendering LaTeX:', error);
        setErrors([`Failed to render LaTeX: ${error.message}`]);
      } finally {
        setLoading(false);
      }
    };
    
    renderLatex();
  }, [latexContent]);

  return (
    <div 
      className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white ${className}`}
      style={{ height }}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner size="md" text="Rendering preview..." />
        </div>
      ) : (
        <div className="h-full overflow-auto">
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errors.length} rendering {errors.length === 1 ? 'error' : 'errors'}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div 
            className="p-8 shadow-inner bg-white text-black"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </div>
  );
}