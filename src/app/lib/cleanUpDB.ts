import { chatsRepository } from '@/db';

async function removeChatsWithNoModel() {
  const regular = await chatsRepository.getAll({});
  const archived = await chatsRepository.getAll({}, true);

  const chats = [...regular, ...archived];

  chats.forEach((chat) => {
    if (chat.model === 'pulsar') {
      console.log('Removing chat with no model', chat.title);
      chatsRepository.remove(chat.id);
    }
  });
}

export function cleanUpDB() {
  removeChatsWithNoModel();
}
