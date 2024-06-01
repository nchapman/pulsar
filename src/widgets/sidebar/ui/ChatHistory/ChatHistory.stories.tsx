import type { Meta, StoryObj } from '@storybook/preact';

import { ChatHistoryUI as ChatHistory } from './ChatHistory.tsx';

const meta: Meta<typeof ChatHistory> = {
  title: 'widgets/ChatHistory/ChatHistory',
  component: ChatHistory,
  args: {},
  decorators: (story) => <div style={{ height: '100vh', width: 320 }}>{story()}</div>,
} satisfies Meta<typeof ChatHistory>;

export default meta;
type Story = StoryObj<typeof ChatHistory>;
export const Primary: Story = {};
