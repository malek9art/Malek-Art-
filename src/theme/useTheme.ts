import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'malek_theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

/**
 * Theme controller.
 * - The initial class is set pre-paint by an inline script in index.html (no FOUC).
 * - This hook keeps React state in sync, persists the choice, and enables smooth
 *   color transitions only after the first paint (via the `theme-ready` class).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    root.style.background = theme === 'light' ? '#eef1f8' : '#07051b';
    // Enable smooth transitions only after first paint.
    const id = requestAnimationFrame(() => root.classList.add('theme-ready'));
    return () => cancelAnimationFrame(id);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggle, setTheme };
}
