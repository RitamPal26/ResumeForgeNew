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
    html = html.replace(/\\geometry\{.*?\}/g, '');
    html = html.replace(/\\definecolor\{.*?\}\{.*?\}\{.*?\}/g, '');
    
    // Handle moderncv commands (for Modern Tech template)
    html = html.replace(/\\moderncvstyle\{.*?\}/g, '');
    html = html.replace(/\\moderncvcolor\{.*?\}/g, '');
    html = html.replace(/\\name\{(.*?)\}\{(.*?)\}/g, '<h1 style="font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0;">$1 $2</h1>');
    html = html.replace(/\\title\{(.*?)\}/g, '<div style="text-align: center; font-style: italic; margin: 5px 0;">$1</div>');
    html = html.replace(/\\address\{(.*?)\}/g, '<div style="text-align: center; margin: 5px 0;">$1</div>');
    html = html.replace(/\\phone\{(.*?)\}/g, '<div style="text-align: center; margin: 5px 0;">Phone: $1</div>');
    html = html.replace(/\\email\{(.*?)\}/g, '<div style="text-align: center; margin: 5px 0;">Email: $1</div>');
    html = html.replace(/\\cventry\{(.*?)\}\{(.*?)\}\{(.*?)\}\{(.*?)\}\{(.*?)\}\{(.*?)\}/g, 
      '<div style="margin: 10px 0;"><strong>$2</strong> - $3<br><em>$4, $5</em><br>$6</div>');
    
    // Handle centerline and makebox (for Minimalist Clean template)
    html = html.replace(/\\centerline\{(.*?)\}/g, '<div style="text-align: center; margin: 5px 0;">$1</div>');
    html = html.replace(/\\makebox\[.*?\]\{(.*?)\}/g, '$1');
    
    // Handle font sizes (all templates)
    html = html.replace(/\{\\Huge\s+(.*?)\}/g, '<span style="font-size: 28px; font-weight: bold;">$1</span>');
    html = html.replace(/\\Huge\s+/g, '<span style="font-size: 28px;">');
    html = html.replace(/\{\\LARGE\s+(.*?)\}/g, '<span style="font-size: 24px; font-weight: bold;">$1</span>');
    html = html.replace(/\\LARGE\s+/g, '<span style="font-size: 24px;">');
    html = html.replace(/\{\\Large\s+(.*?)\}/g, '<span style="font-size: 20px; font-weight: bold;">$1</span>');
    html = html.replace(/\\Large\s+/g, '<span style="font-size: 20px;">');
    html = html.replace(/\{\\large\s+(.*?)\}/g, '<span style="font-size: 18px;">$1</span>');
    html = html.replace(/\\large\s+/g, '<span style="font-size: 18px;">');
    html = html.replace(/\{\\small\s+(.*?)\}/g, '<span style="font-size: 10px;">$1</span>');
    html = html.replace(/\\small\s+/g, '<span style="font-size: 10px;">');
    html = html.replace(/\{\\footnotesize\s+(.*?)\}/g, '<span style="font-size: 9px;">$1</span>');
    html = html.replace(/\\footnotesize\s+/g, '<span style="font-size: 9px;">');
    
    // Handle complex font combinations
    html = html.replace(/\{\\textbf\{\\Huge\s+(.*?)\}\}/g, '<h1 style="font-size: 28px; font-weight: bold; text-align: center; margin: 15px 0;">$1</h1>');
    html = html.replace(/\{\\textbf\{\\LARGE\s+(.*?)\}\}/g, '<h1 style="font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0;">$1</h1>');
    html = html.replace(/\{\\textbf\{\\Large\s+(.*?)\}\}/g, '<h2 style="font-size: 20px; font-weight: bold; margin: 10px 0;">$1</h2>');
    
    // Handle sections with better styling
    html = html.replace(/\\textbf\{\\large\s+(.*?)\}/g, '<h2 style="font-size: 18px; font-weight: bold; margin: 15px 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">$1</h2>');
    html = html.replace(/\\section\*?\{(.*?)\}/g, '<h2 style="font-size: 18px; font-weight: bold; margin: 15px 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">$1</h2>');
    html = html.replace(/\\subsection\*?\{(.*?)\}/g, '<h3 style="font-size: 16px; font-weight: bold; margin: 10px 0 5px 0;">$1</h3>');
    html = html.replace(/\\subsubsection\*?\{(.*?)\}/g, '<h4 style="font-size: 14px; font-weight: bold; margin: 8px 0 3px 0;">$1</h4>');
    
    // Handle text formatting
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
    html = html.replace(/\\textsc\{(.*?)\}/g, '<span style="font-variant: small-caps;">$1</span>');
    html = html.replace(/\\underline\{(.*?)\}/g, '<u>$1</u>');
    html = html.replace(/\\emph\{(.*?)\}/g, '<em>$1</em>');
    html = html.replace(/\\textcolor\{(.*?)\}\{(.*?)\}/g, '<span style="color: $1;">$2</span>');
    html = html.replace(/\\color\{(.*?)\}/g, '<span style="color: $1;">');
    
    // Handle special characters and spacing
    html = html.replace(/\\textbullet/g, '•');
    html = html.replace(/\\bullet/g, '•');
    html = html.replace(/\\cdot/g, '·');
    html = html.replace(/\\;/g, ' '); // thin space
    html = html.replace(/\\:/g, ' '); // medium space
    html = html.replace(/\\quad/g, '<span style="margin-left: 1em;"></span>');
    html = html.replace(/\\qquad/g, '<span style="margin-left: 2em;"></span>');
    html = html.replace(/--/g, '–'); // en dash
    html = html.replace(/---/g, '—'); // em dash
    html = html.replace(/\\~/g, '&nbsp;'); // non-breaking space
    
    // Handle alignment
    html = html.replace(/\\hfill/g, '<span style="float: right;">');
    html = html.replace(/\\hspace\{.*?\}/g, '<span style="margin-left: 1em;"></span>');
    
    // Handle centering and flushing
    html = html.replace(/\\begin\{center\}(.*?)\\end\{center\}/gs, '<div style="text-align: center; margin: 10px 0;">$1</div>');
    html = html.replace(/\\begin\{flushleft\}(.*?)\\end\{flushleft\}/gs, '<div style="text-align: left; margin: 10px 0;">$1</div>');
    html = html.replace(/\\begin\{flushright\}(.*?)\\end\{flushright\}/gs, '<div style="text-align: right; margin: 10px 0;">$1</div>');
    
    // Handle custom itemize without bullets (for clean templates)
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
    
    // Handle enumerate
    html = html.replace(/\\begin\{enumerate\}(?:\[.*?\])?(.*?)\\end\{enumerate\}/gs, (match, content) => {
      const items = content.split('\\item').filter(item => item.trim());
      return '<ol style="margin: 5px 0; padding-left: 20px;">' + 
        items.map(item => `<li style="margin: 2px 0;">${item.trim()}</li>`).join('') + 
        '</ol>';
    });
    
    // Handle description lists (for academic templates)
    html = html.replace(/\\begin\{description\}(.*?)\\end\{description\}/gs, (match, content) => {
      const items = content.split('\\item').filter(item => item.trim());
      return '<dl style="margin: 5px 0;">' + 
        items.map(item => {
          const match = item.match(/\[(.*?)\](.*)/);
          if (match) {
            return `<dt style="font-weight: bold; margin-top: 5px;">${match[1]}</dt><dd style="margin-left: 20px;">${match[2].trim()}</dd>`;
          }
          return `<dd style="margin-left: 20px;">${item.trim()}</dd>`;
        }).join('') + 
        '</dl>';
    });
    
    // Handle horizontal rules and lines
    html = html.replace(/\\hrule/g, '<hr style="border: 1px solid #333; margin: 5px 0;" />');
    html = html.replace(/\\rule\{.*?\}\{.*?\}/g, '<hr style="border: 1px solid #333; margin: 5px 0;" />');
    
    // Handle line breaks and spacing
    html = html.replace(/\\\\/g, '<br />');
    html = html.replace(/\\newline/g, '<br />');
    html = html.replace(/\\vspace\{.*?\}/g, '<div style="margin: 10px 0;"></div>');
    html = html.replace(/\\bigskip/g, '<div style="margin: 15px 0;"></div>');
    html = html.replace(/\\medskip/g, '<div style="margin: 10px 0;"></div>');
    html = html.replace(/\\smallskip/g, '<div style="margin: 5px 0;"></div>');
    
    // Handle tabular environments (for structured layouts)
    html = html.replace(/\\begin\{tabular\}\{.*?\}(.*?)\\end\{tabular\}/gs, (match, content) => {
      const rows = content.split('\\\\').filter(Boolean);
      return '<table style="border-collapse: collapse; margin: 10px 0; width: 100%;">' + 
        rows.map(row => {
          const cells = row.split('&').map(cell => `<td style="padding: 4px 8px; vertical-align: top;">${cell.trim()}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('') + 
        '</table>';
    });
    
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
    html = html.replace(/\\textbackslash/g, '\\');
    
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
      font-size: 11pt;
    ">
      ${html}
    </div>`;
    
  } catch (error) {
    errors.push(`Error converting LaTeX to HTML: ${error.message}`);
  }
  
  return { html, errors };
}
