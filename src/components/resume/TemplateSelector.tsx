import React, { useState } from 'react';
import { LATEX_TEMPLATES, LaTeXTemplate } from '../../utils/latexTemplates';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: LaTeXTemplate) => void;
  currentTemplateId: string;
}

export function TemplateSelector({ onSelectTemplate, currentTemplateId }: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentTemplate = LATEX_TEMPLATES.find(t => t.id === currentTemplateId) || LATEX_TEMPLATES[0];

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentTemplate.name}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
        ) : (
          <ChevronDown className="w-5 h-5 ml-2 -mr-1 text-gray-400" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          role="listbox"
        >
          {LATEX_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={`
                cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700
                ${template.id === currentTemplateId ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-gray-200'}
              `}
              role="option"
              aria-selected={template.id === currentTemplateId}
              onClick={() => {
                onSelectTemplate(template);
                setIsOpen(false);
              }}
            >
              <div className="flex flex-col">
                <span className="font-medium truncate">{template.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {template.description}
                </span>
              </div>
              
              {template.id === currentTemplateId && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 dark:text-primary-400">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}