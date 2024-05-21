import type { Meta, StoryObj } from '@storybook/preact';

import { ChatModel } from '@/db/chat';

import { ChatHistoryItem } from './ChatHistoryItem.tsx';

const chat: Partial<ChatModel> = {
  title: 'Chat title',
  isArchived: false,
  isPinned: false,
  id: '1',
};

const meta: Meta<typeof ChatHistoryItem> = {
  title: 'widgets/ChatHistoryItem/ChatHistoryItem',
  component: ChatHistoryItem,
  args: {
    chat,
    id: '1',
  },
} satisfies Meta<typeof ChatHistoryItem>;

export default meta;
type Story = StoryObj<typeof ChatHistoryItem>;
export const Primary: Story = {};
