import katex from 'katex';
import 'katex/dist/katex.min.css';

export interface LaTeXConversionResult {
  html: string;
  errors: string[];
}

export function convertLatexToHtml(latexContent: string): LaTeXConversionResult {
  const errors: string[] = [];
  let html = latexContent;

  try {
    // Remove LaTeX document structure and preamble commands
    html = html.replace(/\\documentclass\[.*?\]\{.*?\}/g, '');
    html = html.replace(/\\usepackage(?:\[.*?\])?\{.*?\}/g, '');
    html = html.replace(/\\begin\{document\}/g, '');
    html = html.replace(/\\end\{document\}/g, '');
    html = html.replace(/\\pagestyle\{.*?\}/g, '');
    html = html.replace(/\\fancyhf\{\}/g, '');
    html = html.replace(/\\renewcommand\{.*?\}\{.*?\}/g, '');
    html = html.replace(/\\setlength\{.*?\}\{.*?\}/g, '');
    
    // Handle centerline (NEW - for Alex Johnson template)
    html = html.replace(/\\centerline\{(.*?)\}/g, '<div style="text-align: center; margin: 5px 0;">$1</div>');
    
    // Handle font sizes (UPDATED - added \LARGE support)
    html = html.replace(/\{\\textbf\{\\LARGE\s+(.*?)\}\}/g, '<h1 style="font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0;">$1</h1>');
    html = html.replace(/\\textbf\{\\LARGE\s+(.*?)\}/g, '<span style="font-size: 24px; font-weight: bold;">$1</span>');
    html = html.replace(/\\LARGE\s+/g, '<span style="font-size: 24px;">');
    html = html.replace(/\{\\Large\s+(.*?)\}/g, '<span style="font-size: 20px; font-weight: bold;">$1</span>');
    html = html.replace(/\\Large\s+/g, '<span style="font-size: 20px;">');
    html = html.replace(/\{\\large\s+(.*?)\}/g, '<span style="font-size: 18px;">$1</span>');
    html = html.replace(/\\large\s+/g, '<span style="font-size: 18px;">');
    
    // Handle sections with better styling
    html = html.replace(/\\textbf\{\\large\s+(.*?)\}/g, '<h2 style="font-size: 18px; font-weight: bold; margin: 15px 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">$1</h2>');
    html = html.replace(/\\section\*?\{(.*?)\}/g, '<h2 style="font-size: 18px; font-weight: bold; margin: 15px 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">$1</h2>');
    html = html.replace(/\\subsection\*?\{(.*?)\}/g, '<h3 style="font-size: 16px; font-weight: bold; margin: 10px 0 5px 0;">$1</h3>');
    
    // Handle text formatting
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
    html = html.replace(/\\underline\{(.*?)\}/g, '<u>$1</u>');
    html = html.replace(/\\textcolor\{(.*?)\}\{(.*?)\}/g, '<span style="color: $1;">$2</span>');
    
    // Handle special characters and spacing (NEW)
    html = html.replace(/\\textbullet/g, '•');
    html = html.replace(/\\;/g, ' '); // thin space
    html = html.replace(/\\quad/g, '<span style="margin-left: 1em;"></span>');
    html = html.replace(/--/g, '–'); // en dash
    
    // Handle alignment
    html = html.replace(/\\hfill/g, '<span style="float: right;">');
    
    // Handle centering
    html = html.replace(/\\begin\{center\}(.*?)\\end\{center\}/gs, '<div style="text-align: center; margin: 10px 0;">$1</div>');
    
    // Handle custom itemize without bullets (NEW - for Alex Johnson template)
    html = html.replace(/\\begin\{itemize\}\[leftmargin=0pt,\s*label=\{\},.*?\](.*?)\\end\{itemize\}/gs, (match, content) => {
      const items = content.split('\\item').filter(item => item.trim());
      return '<ul style="margin: 5px 0; padding-left: 0; list-style-type: none;">' + 
        items.map(item => `<li style="margin: 2px 0; padding-left: 0;">${item.trim()}</li>`).join('') + 
        '</ul>';
    });
    
    // Handle regular itemize with options
    html = html.replace(/\\begin\{itemize\}(?:\[.*?\])?(.*?)\\end\{itemize\}/gs, (match, content) => {
      const items = content.split('\\item').filter(item => item.trim());
      return '<ul style="margin: 5px 0; padding-left: 20px; list-style-type: disc;">' + 
        items.map(item => `<li style="margin: 2px 0;">${item.trim()}</li>`).join('') + 
        '</ul>';
    });
    
    html = html.replace(/\\begin\{enumerate\}(?:\[.*?\])?(.*?)\\end\{enumerate\}/gs, (match, content) => {
      const items = content.split('\\item').filter(item => item.trim());
      return '<ol style="margin: 5px 0; padding-left: 20px;">' + 
        items.map(item => `<li style="margin: 2px 0;">${item.trim()}</li>`).join('') + 
        '</ol>';
    });
    
    // Handle horizontal rules
    html = html.replace(/\\hrule/g, '<hr style="border: 1px solid #333; margin: 5px 0;" />');
    
    // Handle line breaks and spacing
    html = html.replace(/\\\\/g, '<br />');
    html = html.replace(/\\vspace\{.*?\}/g, '<div style="margin: 10px 0;"></div>');
    
    // Handle math expressions
    const mathExpressions = html.match(/\$\$(.*?)\$\$|\$(.*?)\$/g) || [];
    for (const expr of mathExpressions) {
      try {
        const isDisplayMode = expr.startsWith('$$');
        const mathContent = isDisplayMode 
          ? expr.substring(2, expr.length - 2) 
          : expr.substring(1, expr.length - 1);
        
        const renderedMath = katex.renderToString(mathContent, {
          displayMode: isDisplayMode,
          throwOnError: false
        });
        
        html = html.replace(expr, renderedMath);
      } catch (mathError) {
        errors.push(`Failed to render math expression: ${expr}`);
      }
    }
    
    // Handle special characters
    html = html.replace(/\\&/g, '&');
    html = html.replace(/\\_/g, '_');
    html = html.replace(/\\%/g, '%');
    html = html.replace(/\\#/g, '#');
    html = html.replace(/\\\$/g, '$');
    html = html.replace(/\\\{/g, '{');
    html = html.replace(/\\\}/g, '}');
    
    // Handle tabular environments (simplified)
    html = html.replace(/\\begin\{tabular\}\{.*?\}(.*?)\\end\{tabular\}/gs, (match, content) => {
      const rows = content.split('\\\\').filter(Boolean);
      return '<table style="border-collapse: collapse; margin: 10px 0;">' + 
        rows.map(row => {
          const cells = row.split('&').map(cell => `<td style="padding: 4px 8px; border: 1px solid #ccc;">${cell.trim()}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('') + 
        '</table>';
    });
    
    // Clean up extra whitespace
    html = html.replace(/\n\s*\n/g, '<br>');
    html = html.replace(/\n/g, ' ');
    
    // Wrap the result in a div with resume styling
    html = `<div style="
      font-family: 'Times New Roman', serif; 
      line-height: 1.15; 
      max-width: 8.5in; 
      margin: 0 auto; 
      padding: 20px; 
      background: white; 
      color: black;
      font-size: 10pt;
    ">
      ${html}
    </div>`;
    
  } catch (error) {
    errors.push(`Error converting LaTeX to HTML: ${error.message}`);
  }
  
  return { html, errors };
}
