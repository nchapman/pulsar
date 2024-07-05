import { withThemeByDataAttribute } from '@storybook/addon-themes';

export const themeDecorator = withThemeByDataAttribute({
  themes: {
    light: 'light',
    dark: 'dark',
  },
  defaultTheme: 'dark',
  attributeName: 'data-theme',
  parentSelector: 'body',
});
