import React, { createContext, useContext, useEffect, useState } from 'react';

interface Theme {
  primary: string;
  secondary: string;
  text: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  muted: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const themes = {
  light: {
    primary: '#ffffff',
    secondary: '#f3f4f6',
    text: '#1a1a1a',
    accent: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    muted: '#64748b'
  },
  dark: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
    text: '#ffffff',
    accent: '#3b82f6',
    background: '#0f172a',
    surface: '#1e293b',
    border: '#334155',
    muted: '#94a3b8'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const colors = themes[theme];
    
    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply theme class to body
    document.body.className = theme;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.primary);
    }
  }, [theme]);

  const value = {
    theme,
    colors: themes[theme],
    toggleTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}