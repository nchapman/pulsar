import type { Meta, StoryObj } from '@storybook/preact';

import { OnboardingPage } from './OnboardingPage.tsx';

const meta: Meta<typeof OnboardingPage> = {
  title: 'widgets/OnboardingPage/OnboardingPage',
  component: OnboardingPage,
  decorators: (story) => <div style={{ height: 7840, width: 600 }}>{story()}</div>,
} satisfies Meta<typeof OnboardingPage>;

export default meta;
type Story = StoryObj<typeof OnboardingPage>;
export const Primary: Story = {};
