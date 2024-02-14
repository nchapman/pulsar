import { Theme } from './ThemeContext';

export function getDefaultTheme() {
  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isSystemDark) {
    return Theme.DARK;
  }

  return Theme.LIGHT;
}
