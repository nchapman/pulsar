import { tableSchema } from '@nozbe/watermelondb';

export const chatsTable = {
  name: 'chat',
  cols: {
    title: 'title',
    messages: 'messages',
    model: 'model',
    modelSettings: 'model_settings',
    isPinned: 'is_pinned',
    isArchived: 'is_archived',
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
    { name: chatsTable.cols.modelSettings, type: 'string', isOptional: true },
    { name: chatsTable.cols.isArchived, type: 'string', isOptional: true },
    { name: chatsTable.cols.isPinned, type: 'string', isOptional: true },
    { name: chatsTable.cols.createdAt, type: 'number' },
    { name: chatsTable.cols.updatedAt, type: 'number' },
  ],
});
