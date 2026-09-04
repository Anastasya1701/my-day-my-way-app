import type { Theme } from './types';

export function prefersDark(): boolean {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/** No stored theme means "follow the system", exactly as in the MVP. */
export function isDark(theme: Theme | null): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return prefersDark();
}
