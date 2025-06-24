import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import type { UnifiedScore } from '../types/leetcode';
import type { DeveloperAnalysis } from '../types/github';

interface PDFReportData {
  unifiedScore: UnifiedScore;
  githubAnalysis?: DeveloperAnalysis;
  usernames: {
    github: string;
    leetcode: string;
  };
  generatedAt: string;
}

class PDFReportGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private primaryColor: string;
  private secondaryColor: string;
  private textColor: string;
  private lightGray: string;

  constructor() {
    this.doc = new jsPDF('portrait', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 25.4; // 1 inch in mm
    this.currentY = this.margin;
    this.primaryColor = '#2563eb';
    this.secondaryColor = '#1e40af';
    this.textColor = '#1a1a1a';
    this.lightGray = '#f3f4f6';
  }

  async generateReport(data: PDFReportData): Promise<Blob> {
    try {
      // Generate unique report ID
      const reportId = this.generateReportId();
      
      // Page 1: Header, Summary, and Key Metrics
      await this.addHeader(data, reportId);
      await this.addExecutiveSummary(data);
      await this.addKeyMetrics(data);
      
      // Page 2: Technical Analysis
      this.addNewPage();
      await this.addTechnicalAnalysis(data);
      
      // Page 3: Professional Assessment
      this.addNewPage();
      await this.addProfessionalAssessment(data);
      
      // Add footer to all pages
      this.addFooters(reportId);
      
      return new Blob([this.doc.output('blob')], { type: 'application/pdf' });
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  private generateReportId(): string {
    return `RF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }

  private async addHeader(data: PDFReportData, reportId: string) {
    // ResumeForge Logo (text-based for simplicity)
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.primaryColor);
    this.doc.text('ResumeForge', this.margin, this.currentY);
    
    // Title
    this.doc.setFontSize(20);
    this.doc.setTextColor(this.textColor);
    this.doc.text('Developer Profile Analysis', this.margin, this.currentY + 15);
    
    // Report info (right aligned)
    const rightX = this.pageWidth - this.margin;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Report ID: ${reportId}`, rightX, this.currentY, { align: 'right' });
    this.doc.text(`Generated: ${new Date(data.generatedAt).toLocaleDateString()}`, rightX, this.currentY + 5, { align: 'right' });
    
    // Developer info
    this.currentY += 25;
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Developer: ${data.usernames.github}`, this.margin, this.currentY);
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`GitHub: ${data.usernames.github} | LeetCode: ${data.usernames.leetcode}`, this.margin, this.currentY + 8);
    
    this.currentY += 20;
    this.addHorizontalLine();
  }

  private async addExecutiveSummary(data: PDFReportData) {
    this.currentY += 10;
    
    // Section title
    this.addSectionTitle('Executive Summary');
    
    // Overall score with circular progress (simplified as text)
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.primaryColor);
    this.doc.text(`Overall Developer Score: ${data.unifiedScore.overall}/100`, this.margin, this.currentY);
    
    // Score interpretation
    const scoreLevel = this.getScoreLevel(data.unifiedScore.overall);
    this.doc.setFontSize(12);
    this.doc.setTextColor(this.textColor);
    this.doc.text(`Performance Level: ${scoreLevel}`, this.margin, this.currentY + 8);
    
    this.currentY += 20;
    
    // Strength summary
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Key Strengths:', this.margin, this.currentY);
    this.currentY += 8;
    
    this.doc.setFont('helvetica', 'normal');
    const strengths = data.unifiedScore.breakdown.strengths.slice(0, 3);
    strengths.forEach((strength, index) => {
      this.doc.text(`• ${strength}`, this.margin + 5, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 5;
  }

  private async addKeyMetrics(data: PDFReportData) {
    this.addSectionTitle('Key Performance Metrics');
    
    // Create metrics grid
    const metrics = [
      { label: 'GitHub Score', value: `${data.unifiedScore.github.overall}/100`, color: this.primaryColor },
      { label: 'LeetCode Score', value: `${data.unifiedScore.leetcode.overall}/100`, color: this.secondaryColor },
      { label: 'Interview Readiness', value: `${data.unifiedScore.interviewReadiness.overall}/100`, color: '#10b981' },
      { label: 'Balance Score', value: `${data.unifiedScore.breakdown.balanceScore}/100`, color: '#f59e0b' }
    ];
    
    const boxWidth = (this.pageWidth - 2 * this.margin - 15) / 2;
    const boxHeight = 25;
    
    metrics.forEach((metric, index) => {
      const x = this.margin + (index % 2) * (boxWidth + 15);
      const y = this.currentY + Math.floor(index / 2) * (boxHeight + 10);
      
      // Draw metric box
      this.doc.setFillColor(metric.color);
      this.doc.rect(x, y, boxWidth, boxHeight, 'F');
      
      // Add metric text
      this.doc.setTextColor('#ffffff');
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(metric.label, x + 5, y + 8);
      
      this.doc.setFontSize(16);
      this.doc.text(metric.value, x + 5, y + 18);
    });
    
    this.currentY += 60;
  }

  private async addTechnicalAnalysis(data: PDFReportData) {
    this.addSectionTitle('Technical Analysis');
    
    // GitHub Metrics
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.textColor);
    this.doc.text('GitHub Performance', this.margin, this.currentY);
    this.currentY += 10;
    
    const githubMetrics = [
      { label: 'Repository Quality', value: data.unifiedScore.github.repository },
      { label: 'Language Proficiency', value: data.unifiedScore.github.language },
      { label: 'Collaboration Score', value: data.unifiedScore.github.collaboration },
      { label: 'Project Complexity', value: data.unifiedScore.github.complexity },
      { label: 'Development Activity', value: data.unifiedScore.github.activity }
    ];
    
    this.addMetricsTable(githubMetrics);
    this.currentY += 20;
    
    // LeetCode Metrics
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LeetCode Performance', this.margin, this.currentY);
    this.currentY += 10;
    
    const leetcodeMetrics = [
      { label: 'Problem Solving', value: data.unifiedScore.leetcode.problemSolving },
      { label: 'Contest Performance', value: data.unifiedScore.leetcode.contest },
      { label: 'Practice Consistency', value: data.unifiedScore.leetcode.consistency },
      { label: 'Difficulty Mastery', value: data.unifiedScore.leetcode.difficulty }
    ];
    
    this.addMetricsTable(leetcodeMetrics);
  }

  private async addProfessionalAssessment(data: PDFReportData) {
    this.addSectionTitle('Professional Assessment');
    
    // Core Strengths
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.textColor);
    this.doc.text('Core Strengths', this.margin, this.currentY);
    this.currentY += 10;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    data.unifiedScore.breakdown.strengths.forEach((strength) => {
      this.doc.text(`• ${strength}`, this.margin + 5, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 10;
    
    // Growth Areas
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Areas for Growth', this.margin, this.currentY);
    this.currentY += 10;
    
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    data.unifiedScore.breakdown.weaknesses.forEach((weakness) => {
      this.doc.text(`• ${weakness}`, this.margin + 5, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 15;
    
    // Recommendations
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Specific Recommendations', this.margin, this.currentY);
    this.currentY += 10;
    
    data.unifiedScore.recommendations.forEach((rec, index) => {
      if (this.currentY > this.pageHeight - 40) {
        this.addNewPage();
      }
      
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(this.getPriorityColor(rec.priority));
      this.doc.text(`${index + 1}. ${rec.action} (${rec.priority} Priority)`, this.margin, this.currentY);
      
      this.currentY += 6;
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(this.textColor);
      
      const lines = this.doc.splitTextToSize(rec.description, this.pageWidth - 2 * this.margin - 10);
      lines.forEach((line: string) => {
        this.doc.text(line, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
      
      this.currentY += 5;
    });
  }

  private addMetricsTable(metrics: { label: string; value: number }[]) {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const rowHeight = 8;
    
    metrics.forEach((metric, index) => {
      const y = this.currentY + index * rowHeight;
      
      // Alternating row colors
      if (index % 2 === 0) {
        this.doc.setFillColor(this.lightGray);
        this.doc.rect(this.margin, y - 2, tableWidth, rowHeight, 'F');
      }
      
      // Metric label
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(this.textColor);
      this.doc.text(metric.label, this.margin + 2, y + 3);
      
      // Progress bar
      const barWidth = 60;
      const barX = this.pageWidth - this.margin - barWidth - 20;
      
      // Background bar
      this.doc.setFillColor('#e5e7eb');
      this.doc.rect(barX, y, barWidth, 4, 'F');
      
      // Progress bar
      const progressWidth = (metric.value / 100) * barWidth;
      this.doc.setFillColor(this.getScoreColor(metric.value));
      this.doc.rect(barX, y, progressWidth, 4, 'F');
      
      // Score text
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${metric.value}`, barX + barWidth + 5, y + 3);
    });
    
    this.currentY += metrics.length * rowHeight + 5;
  }

  private addSectionTitle(title: string) {
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(this.primaryColor);
    this.doc.text(title, this.margin, this.currentY);
    this.currentY += 12;
    
    // Add underline
    this.doc.setDrawColor(this.primaryColor);
    this.doc.line(this.margin, this.currentY - 2, this.margin + 60, this.currentY - 2);
    this.currentY += 5;
  }

  private addHorizontalLine() {
    this.doc.setDrawColor('#e5e7eb');
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
  }

  private addNewPage() {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  private addFooters(reportId: string) {
    const totalPages = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor('#e5e7eb');
      this.doc.line(this.margin, this.pageHeight - 20, this.pageWidth - this.margin, this.pageHeight - 20);
      
      // Footer text
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor('#6b7280');
      
      // Left: ResumeForge branding
      this.doc.text('Generated by ResumeForge - Professional Developer Analysis', this.margin, this.pageHeight - 12);
      
      // Right: Page number
      this.doc.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin, this.pageHeight - 12, { align: 'right' });
      
      // Center: Report ID
      this.doc.text(`Report ID: ${reportId}`, this.pageWidth / 2, this.pageHeight - 12, { align: 'center' });
    }
  }

  private getScoreLevel(score: number): string {
    if (score >= 85) return 'Excellent';
    if (score >= 75) return 'Very Good';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  }

  private getScoreColor(score: number): string {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  }

  private getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#10b981';
      default: return this.textColor;
    }
  }
}

export const pdfGenerator = new PDFReportGenerator();
export default pdfGenerator;