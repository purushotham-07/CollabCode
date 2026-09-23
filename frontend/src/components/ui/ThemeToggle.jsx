import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('collabcode_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('collabcode_theme', theme);
    window.dispatchEvent(new CustomEvent('collabcode_theme_change', { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`p-1.5 rounded-full text-[#86868b] hover:text-text-primary hover:bg-white/[0.08] dark:hover:bg-white/[0.08] transition-colors focus-ring cursor-pointer ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5 text-[#ff9f0a]" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#1d1d1f]" />
      )}
    </button>
  );
}

export default ThemeToggle;
