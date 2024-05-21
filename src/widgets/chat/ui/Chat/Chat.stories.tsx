import type { Meta, StoryObj } from '@storybook/preact';

import { DEFAULT_LLM } from '@/entities/model';

import { Chat } from './Chat';

const meta: Meta<typeof Chat> = {
  title: 'widgets/Chat/Chat',
  component: Chat,
  args: {
    model: DEFAULT_LLM,
  },
  decorators: (story) => <div style={{ height: '100vh' }}>{story()}</div>,
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof Chat>;
export const Primary: Story = {};