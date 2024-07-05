import type { Meta, StoryObj } from '@storybook/preact';

import { Progress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'shared/Progress',
  component: Progress,
  args: {
    percent: 60,
  },
  decorators: (Story: any) => (
    <div style={{ width: 400 }}>
      <Story />
    </div>
  ),
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};
