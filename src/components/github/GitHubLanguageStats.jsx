import React from 'react';

export function GitHubLanguageStats({ languages }) {
  if (!languages || languages.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-500">
        No language data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Language Bars */}
      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={lang.language} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-sm font-medium text-secondary-900">
                  {lang.language}
                </span>
              </div>
              <span className="text-sm text-secondary-600">
                {lang.percentage}%
              </span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  backgroundColor: lang.color,
                  width: `${lang.percentage}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="pt-4 border-t border-secondary-200">
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <div
              key={lang.language}
              className="flex items-center space-x-1 px-3 py-1 bg-secondary-50 rounded-full text-sm"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-secondary-700">{lang.language}</span>
              <span className="text-secondary-500">({lang.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}