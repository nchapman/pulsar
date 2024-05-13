import type { Meta, StoryObj } from '@storybook/preact';

import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'shared/Select',
  component: Select,
  args: {
    options: [
      { value: '1', label: 'Apple' },
      { value: '2', label: 'Orange' },
      { value: '3', label: 'Grapefruit' },
    ],
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {};
