import type { Meta, StoryObj } from '@storybook/preact';

import { Sidebar } from './Sidebar.tsx';

const meta: Meta<typeof Sidebar> = {
  title: 'widgets/Sidebar/Sidebar',
  component: Sidebar,
  args: {
    open: true,
  },
  decorators: (story) => <div style={{ width: 260, position: 'relative' }}>{story()}</div>,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;
export const Primary: Story = {};
