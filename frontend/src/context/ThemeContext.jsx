import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const getInitialDark = () => {
  try {
    const saved = localStorage.getItem('campusflow_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

const applyTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  try {
    localStorage.setItem('campusflow_theme', isDark ? 'dark' : 'light');
  } catch {}
};

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(getInitialDark);

  useEffect(() => {
    applyTheme(dark);
  }, [dark]);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      applyTheme(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
