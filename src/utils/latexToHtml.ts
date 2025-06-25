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
    // Remove LaTeX document structure
    html = html.replace(/\\documentclass\[.*?\]\{.*?\}/g, '');
    html = html.replace(/\\usepackage(?:\[.*?\])?\{.*?\}/g, '');
    html = html.replace(/\\begin\{document\}/g, '');
    html = html.replace(/\\end\{document\}/g, '');
    
    // Handle sections
    html = html.replace(/\\section\*?\{(.*?)\}/g, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>');
    html = html.replace(/\\subsection\*?\{(.*?)\}/g, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
    
    // Handle text formatting
    html = html.replace(/\\textbf\{(.*?)\}/g, '<strong>$1</strong>');
    html = html.replace(/\\textit\{(.*?)\}/g, '<em>$1</em>');
    html = html.replace(/\\underline\{(.*?)\}/g, '<u>$1</u>');
    html = html.replace(/\\textcolor\{(.*?)\}\{(.*?)\}/g, '<span style="color: $1;">$2</span>');
    
    // Handle lists
    html = html.replace(/\\begin\{itemize\}(.*?)\\end\{itemize\}/gs, (match, content) => {
      const items = content.split('\\item').filter(Boolean);
      return '<ul class="list-disc pl-6 my-2">' + 
        items.map(item => `<li>${item.trim()}</li>`).join('') + 
        '</ul>';
    });
    
    html = html.replace(/\\begin\{enumerate\}(.*?)\\end\{enumerate\}/gs, (match, content) => {
      const items = content.split('\\item').filter(Boolean);
      return '<ol class="list-decimal pl-6 my-2">' + 
        items.map(item => `<li>${item.trim()}</li>`).join('') + 
        '</ol>';
    });
    
    // Handle horizontal rules
    html = html.replace(/\\hrule/g, '<hr class="my-2 border-gray-300" />');
    
    // Handle centering
    html = html.replace(/\\begin\{center\}(.*?)\\end\{center\}/gs, '<div class="text-center">$1</div>');
    
    // Handle line breaks and paragraphs
    html = html.replace(/\\\\/g, '<br />');
    html = html.replace(/\\vspace\{.*?\}/g, '<div class="my-2"></div>');
    
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
    
    // Handle tabular environments (simplified)
    html = html.replace(/\\begin\{tabular\}\{.*?\}(.*?)\\end\{tabular\}/gs, (match, content) => {
      const rows = content.split('\\\\').filter(Boolean);
      return '<table class="border-collapse my-2">' + 
        rows.map(row => {
          const cells = row.split('&').map(cell => `<td class="px-2 py-1">${cell.trim()}</td>`).join('');
          return `<tr>${cells}</tr>`;
        }).join('') + 
        '</table>';
    });
    
    // Wrap the result in a div with resume styling
    html = `<div class="resume-preview p-8 bg-white text-black">
      ${html}
    </div>`;
    
  } catch (error) {
    errors.push(`Error converting LaTeX to HTML: ${error.message}`);
  }
  
  return { html, errors };
}