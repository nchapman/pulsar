import type { Meta, StoryObj } from '@storybook/preact';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'shared/Text',
  component: Text,
  args: {
    children: 'Hello, World!',
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof Text>;

export const Primary: Story = {
  args: { c: 'primary', w: 'normal', s: 14 },
};

export const Secondary: Story = {
  args: { c: 'secondary', w: 'normal', s: 14 },
};

export const Tertiary: Story = {
  args: { c: 'tertiary', w: 'normal', s: 14 },
};

export const Normal: Story = {
  args: { w: 'normal' },
};

export const Medium: Story = {
  args: { w: 'medium' },
};

export const SemiBold: Story = {
  args: { w: 'semi' },
};

export const Bold: Story = {
  args: { w: 'bold' },
};

export const Small: Story = {
  args: { s: 12 },
};

export const Large: Story = {
  args: { s: 18 },
};

export const ExtraLarge: Story = {
  args: { s: 24 },
};
