import type { Meta, StoryObj } from '@storybook/preact';

import { Logo } from './Logo';

const meta: Meta<typeof Logo> = {
  title: 'shared/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof Logo>;

export const Small: Story = {
  args: { size: 's' },
};

export const Medium: Story = {
  args: { size: 'm' },
};
