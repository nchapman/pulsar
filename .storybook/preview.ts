import type { Preview } from '@storybook/preact';
import { SpacingDecorator, themeDecorator } from '../src/shared/storybook';
import '@/shared/styles/index.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [SpacingDecorator, themeDecorator],
};

export default preview;
