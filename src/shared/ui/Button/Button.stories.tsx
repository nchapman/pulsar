import type { Meta, StoryObj } from '@storybook/preact';

import ArrowDownIcon from '@/shared/assets/icons/arrow-down.svg';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'shared/Button',
  component: Button,
  args: {
    children: 'Pulsar',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Link: Story = {
  args: { variant: 'link' },
};

export const Clear: Story = {
  args: { variant: 'clear' },
};

export const Danger: Story = {
  args: { variant: 'danger' },
};

export const IconPrimary: Story = {
  args: { variant: 'primary', icon: ArrowDownIcon },
};

export const IconSecondary: Story = {
  args: { variant: 'secondary', icon: ArrowDownIcon },
};

export const IconClear: Story = {
  args: { variant: 'clear', icon: ArrowDownIcon },
};
