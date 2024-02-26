import { ChatMsg } from '@/db/chat';

export const mockMessages: ChatMsg[] = [
  { text: 'My Question', isUser: true, id: '1' },
  { text: 'My Answer', isUser: false, id: '2' },
];

export const mockMessages2: ChatMsg[] = [
  { text: 'Ocean Drive', isUser: true, id: '1' },
  { text: 'Redrum', isUser: false, id: '2' },
];

export const chats: Record<Id, ChatMsg[]> = {
  '1': mockMessages,
  '2': mockMessages2,
  '3': [],
};
