import React, { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import pdfGenerator from '../../services/pdfGenerator';
import type { UnifiedScore } from '../../types/leetcode';
import type { DeveloperAnalysis } from '../../types/github';

interface PDFReportButtonProps {
  unifiedScore: UnifiedScore;
  githubAnalysis?: DeveloperAnalysis;
  usernames: {
    github: string;
    leetcode: string;
  };
  className?: string;
}

export function PDFReportButton({ 
  unifiedScore, 
  githubAnalysis, 
  usernames, 
  className = '' 
}: PDFReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    setStatus('generating');
    setError(null);

    try {
      const reportData = {
        unifiedScore,
        githubAnalysis,
        usernames,
        generatedAt: new Date().toISOString()
      };

      const pdfBlob = await pdfGenerator.generateReport(reportData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `developer-profile-${usernames.github}-${usernames.leetcode}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      setStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
      
    } catch (err) {
      console.error('PDF generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF report');
      setStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setError(null);
      }, 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'generating':
        return (
          <>
            <LoadingSpinner size="sm" />
            <span>Generating PDF...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Downloaded!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (status) {
      case 'success':
        return 'primary';
      case 'error':
        return 'outline';
      default:
        return 'primary';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={generatePDFReport}
        disabled={isGenerating}
        variant={getButtonVariant()}
        className="flex items-center space-x-2"
      >
        {getButtonContent()}
      </Button>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 dark:text-red-200">PDF Generation Failed</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'generating' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Generating Professional Report</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Creating a comprehensive PDF analysis with charts and recommendations...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Report Generated Successfully</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your professional developer profile report has been downloaded.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}