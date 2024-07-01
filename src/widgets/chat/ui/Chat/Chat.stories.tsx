import type { Meta, StoryObj } from '@storybook/preact';

import { switchChat } from '../../model/chat.ts';
import { Chat } from './Chat';

const meta: Meta<typeof Chat> = {
  title: 'widgets/Chat/Chat',
  component: Chat,
  decorators: (story) => <div style={{ height: '100vh' }}>{story()}</div>,
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof Chat>;
export const Primary: Story = {
  play: () => {
    switchChat('');
  },
};

export const Archived: Story = {
  args: {
    isChatArchived: true,
  },
  play: () => {
    switchChat('1');
  },
};
