import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 mr-2 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-all duration-300 dark:text-gray-400 dark:hover:text-amber-400 dark:hover:bg-slate-800"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
