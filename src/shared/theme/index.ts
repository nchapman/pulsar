import { createEvent, createStore, sample } from 'effector';

export type Theme = 'light' | 'dark' | 'system';

const THEME_LS_KEY = 'theme';
const THEME_BODY_ATTR = 'data-theme';

export const $theme = createStore<Theme>('dark');

export const changeTheme = createEvent<Theme>();

export const initTheme = () => {
  changeTheme((localStorage.getItem(THEME_LS_KEY) as Theme) || 'dark');
};

sample({
  clock: changeTheme,
  fn: (theme) => {
    const method = theme === 'system' ? 'removeAttribute' : 'setAttribute';
    document.body[method](THEME_BODY_ATTR, theme);

    localStorage.setItem('theme', theme);

    return theme;
  },
  target: $theme,
});
