import { Chat } from '@/db/chat/chat.repository.ts';

import { chatsMock } from './chats.mock.ts';

export class ChatsRepositoryMock {
  chats: Chat[] = chatsMock;

  async getById(id: Id): Promise<Chat> {
    return Promise.resolve(this.chats.find((chat) => chat.id === id) as Chat);
  }

  async getAll(_?: any, __ = false): Promise<Chat[]> {
    return Promise.resolve(this.chats);
  }

  async create(data: Dto<Chat>): Promise<Chat> {
    const newChat = {
      ...data,
      id: String(this.chats.length + 1),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.chats.push(newChat);
    return Promise.resolve(newChat);
  }

  async update(id: Id, data: UpdateDto<Chat>): Promise<Chat> {
    const chat = this.chats.find((chat) => chat.id === id) as Chat;
    if (!chat) return Promise.resolve(chat);

    Object.assign(chat, data);
    return Promise.resolve(chat);
  }

  async remove(id: Id): Promise<void> {
    this.chats = this.chats.filter((chat) => chat.id !== id);
    return Promise.resolve();
  }

  async archiveAll(): Promise<void> {
    this.chats = this.chats.map((chat) => ({ ...chat, isArchived: true }));
    return Promise.resolve();
  }

  async removeAll(): Promise<void> {
    this.chats = [];
    return Promise.resolve();
  }
}
