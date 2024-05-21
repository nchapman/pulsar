import type { Meta, StoryObj } from '@storybook/preact';

import { DEFAULT_LLM } from '@/entities/model';

import { WelcomeScreen } from './WelcomeScreen';

const meta: Meta<typeof WelcomeScreen> = {
  title: 'widgets/WelcomeScreen/WelcomeScreen',
  component: WelcomeScreen,
  args: {
    model: DEFAULT_LLM,
  },
} satisfies Meta<typeof WelcomeScreen>;

export default meta;
type Story = StoryObj<typeof WelcomeScreen>;
export const Primary: Story = {};
