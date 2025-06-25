import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface LaTeXEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  className?: string;
}

export function LaTeXEditor({ value, onChange, height = '70vh', className = '' }: LaTeXEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Configure LaTeX syntax highlighting
    monaco.languages.register({ id: 'latex' });
    
    monaco.languages.setMonarchTokensProvider('latex', {
      tokenizer: {
        root: [
          // Comments
          [/%.+$/, 'comment'],
          
          // Commands
          [/\\[a-zA-Z]+/, 'keyword'],
          
          // Braces
          [/\{/, 'delimiter.curly'],
          [/\}/, 'delimiter.curly'],
          
          // Brackets
          [/\[/, 'delimiter.square'],
          [/\]/, 'delimiter.square'],
          
          // Math mode
          [/\$\$/, 'delimiter.latex'],
          [/\$/, 'delimiter.latex'],
          
          // Special characters
          [/\\[&%$#_{}~^\\]/, 'string'],
          
          // Environment
          [/\\begin\{[a-zA-Z*]+\}/, 'keyword'],
          [/\\end\{[a-zA-Z*]+\}/, 'keyword'],
        ]
      }
    });
    
    // Configure editor settings
    editor.updateOptions({
      wordWrap: 'on',
      lineNumbers: 'on',
      matchBrackets: 'always',
      autoIndent: 'full',
      tabSize: 2,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
    });
  };

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      <Editor
        height={height}
        defaultLanguage="latex"
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
        }}
        theme="vs-dark"
      />
    </div>
  );
}