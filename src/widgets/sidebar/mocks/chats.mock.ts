import { Chat } from '@/db/chat';

export const chatsMock: Chat[] = [
  {
    id: '1',
    title: 'Chat 1',
    model: 'LLM',
    isPinned: false,
    isArchived: false,
    createdAt: new Date().getUTCSeconds(),
    messages: [],
    updatedAt: new Date().getUTCSeconds(),
  },
];
