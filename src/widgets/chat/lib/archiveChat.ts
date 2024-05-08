import { chatsRepository } from '@/db';
import { confirm } from '@/shared/ui';
import { updateChatHistory } from '@/widgets/sidebar';

import { startNewChat } from '../model/chat.ts';

export const archiveAllChats = async () => {
  await chatsRepository.archiveAll();
  updateChatHistory();
  startNewChat();
};

export const archiveAllChatsWithConfirm = () => {
  confirm({
    title: 'Archive all chats',
    message: 'Archive chat history, Are you sure?',
    type: 'info',
    onConfirm: archiveAllChats,
    confirmText: 'Confirm archive',
  });
};
