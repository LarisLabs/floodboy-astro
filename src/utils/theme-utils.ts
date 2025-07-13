// Theme management utilities

export type Theme = 'light' | 'dark';

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme') as Theme;
  if (stored && (stored === 'light' || stored === 'dark')) {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: Theme): void => {
  if (typeof document === 'undefined') return;
  
  document.body.className = document.body.className.replace(/\b(light|dark)\b/g, '');
  document.body.classList.add(theme);
};

export const toggleTheme = (currentTheme: Theme): Theme => {
  return currentTheme === 'light' ? 'dark' : 'light';
};

// Theme-aware class generators
export const getCardClasses = (theme: Theme): string => {
  return `rounded-lg p-6 border ${
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200 shadow-sm'
  }`;
};

export const getTextClasses = (theme: Theme, variant: 'primary' | 'secondary' = 'primary'): string => {
  if (variant === 'secondary') {
    return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  }
  return theme === 'dark' ? 'text-white' : 'text-gray-900';
};

export const getInputClasses = (theme: Theme): string => {
  return `px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
  } border`;
};

export const getButtonClasses = (
  theme: Theme, 
  variant: 'primary' | 'secondary' | 'ghost' = 'primary'
): string => {
  const base = 'px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  switch (variant) {
    case 'primary':
      return `${base} bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-600`;
    case 'secondary':
      return `${base} ${
        theme === 'dark'
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`;
    case 'ghost':
      return `${base} ${
        theme === 'dark'
          ? 'text-gray-400 hover:text-white hover:bg-gray-700'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`;
  }
};

export const getTabClasses = (theme: Theme, isActive: boolean): string => {
  return `px-4 py-2 rounded-lg transition-colors ${
    isActive 
      ? 'bg-purple-600 text-white' 
      : theme === 'dark'
        ? 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
        : 'bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-300'
  }`;
};

export const getBadgeClasses = (
  color: 'purple' | 'green' | 'blue' | 'yellow' | 'red' = 'purple'
): string => {
  const colorMap = {
    purple: 'bg-purple-600/20 text-purple-400 border-purple-500',
    green: 'bg-green-600/20 text-green-400 border-green-500',
    blue: 'bg-blue-600/20 text-blue-400 border-blue-500',
    yellow: 'bg-yellow-600/20 text-yellow-400 border-yellow-500',
    red: 'bg-red-600/20 text-red-400 border-red-500',
  };
  
  return `px-3 py-1 ${colorMap[color]} border rounded-full text-xs font-medium`;
};