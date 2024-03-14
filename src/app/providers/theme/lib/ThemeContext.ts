import { createContext } from 'preact';

export enum Theme {
  LIGHT = 'app-light-theme',
  DARK = 'app-dark-theme',
}

export interface ThemeContextProps {
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({});
