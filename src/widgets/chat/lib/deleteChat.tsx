import { chatsRepository } from '@/db';
import { confirm, Text } from '@/shared/ui';
import { updateChatHistory } from '@/widgets/sidebar';

import { $chat, startNewChat } from '../model/chat.ts';

export function deleteChat(id: Id, isCurrent: boolean) {
  chatsRepository.remove(id);
  if (isCurrent) startNewChat();
}

export const deleteChatWithConfirm = async (id: Id) => {
  const { title } = await chatsRepository.getById(id);

  const isCurrent = $chat.id.getState() === id;

  confirm({
    title: 'Delete chat?',
    message: (
      <>
        This will delete <Text c="primary">{title}</Text>
      </>
    ),
    type: 'danger',
    onConfirm: () => deleteChat(id, isCurrent),
    confirmText: 'Delete',
  });
};

export const deleteAllChats = async () => {
  await chatsRepository.removeAll();
  updateChatHistory();
  startNewChat();
};

export const deleteAllChatsWithConfirm = () => {
  confirm({
    title: 'Delete all of your chats?',
    message:
      "Deleting all chats is irreversible. This action will permanently remove all conversations, and you won't be able to retrieve any messages or information from these chats in the future. Proceed with caution.",
    type: 'danger',
    onConfirm: deleteAllChats,
    confirmText: 'Confirm deletion',
  });
};
