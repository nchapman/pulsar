import { tableSchema } from '@nozbe/watermelondb';

export const chatsTable = {
  name: 'chat',
  cols: {
    title: 'title',
    messages: 'messages',
    model: 'model',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

export const chatSchema = tableSchema({
  name: chatsTable.name,
  columns: [
    { name: chatsTable.cols.title, type: 'string' },
    { name: chatsTable.cols.messages, type: 'string' },
    { name: chatsTable.cols.model, type: 'string' },
    { name: chatsTable.cols.createdAt, type: 'number' },
    { name: chatsTable.cols.updatedAt, type: 'number' },
  ],
});
